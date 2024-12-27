package com.vibrix.catalog.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibrix.catalog.application.SongService;
import com.vibrix.catalog.application.dto.ReadSongDTO;
import com.vibrix.catalog.application.dto.SaveSongDTO;
import com.vibrix.user.application.UserService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SongController {
    private final SongService songService;
    private final Validator validator;
    private final UserService userService;
    private final ObjectMapper mapper = new ObjectMapper();

    public SongController(SongService songService, Validator validator, UserService userService) {
        this.songService = songService;
        this.validator = validator;
        this.userService = userService;
    }

    @PostMapping(value = "/songs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReadSongDTO> add(
        @RequestPart(name = "cover") MultipartFile cover,
        @RequestPart(name = "file") MultipartFile file,
        @RequestPart(name = "dto") String dto) throws IOException {
        var info = mapper.readValue(dto, SaveSongDTO.class);
        var song = SaveSongDTO.of(info.title(), info.author(), cover, file);
        var violations = validator.validate(song);
        return violations.isEmpty()
            ? ResponseEntity.ok(songService.add(song))
            : ResponseEntity.of(getProblemDetail(violations)).build();
    }

    private static ProblemDetail getProblemDetail(Set<ConstraintViolation<SaveSongDTO>> violations) {
        var joined = violations.stream()
                .map(v -> v.getPropertyPath() + " " + v.getMessage())
                .collect(Collectors.joining());
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Invalid fields: " + joined);
    }
}
