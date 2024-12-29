package com.vibrix.catalog.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibrix.catalog.application.SongService;
import com.vibrix.catalog.application.dto.ContentDTO;
import com.vibrix.catalog.application.dto.ReadSongDTO;
import com.vibrix.catalog.application.dto.SaveSongDTO;
import com.vibrix.user.application.UserService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;
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

    @GetMapping("/songs")
    public ResponseEntity<List<ReadSongDTO>> list() {
        return ResponseEntity.ok(songService.list());
    }

    @GetMapping("/songs/content")
    public ResponseEntity<ContentDTO> one(@RequestParam UUID publicId) {
        var content = songService.one(publicId);
        return content.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.of(notFound()).build());
    }

    private static ProblemDetail notFound() {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "UUID not found");
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
            : ResponseEntity.of(invalidFields(violations)).build();
    }

    private static ProblemDetail invalidFields(Set<ConstraintViolation<SaveSongDTO>> violations) {
        var joined = violations.stream()
                .map(v -> v.getPropertyPath() + " " + v.getMessage())
                .collect(Collectors.joining());
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Invalid fields: " + joined);
    }
}
