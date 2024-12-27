package com.vibrix.user.application;

import com.vibrix.user.application.dto.ReadUserDTO;
import com.vibrix.user.mapper.UserMapper;
import com.vibrix.user.model.User;
import com.vibrix.user.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.function.Function;

@Service
public class UserService {
    private final UserRepository repository;
    private final UserMapper mapper;

    public UserService(UserRepository repository, UserMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public ReadUserDTO getAuthUser() {
        var principal = (OAuth2User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return mapper.toReadUserDTO(toUser(principal.getAttributes()));
    }

    public void sync(OAuth2User principal) {
        var updatedAt = principal.getAttributes().get("updated_at");
        if (updatedAt == null) return;
        record UserRecord(Instant updatedAtDb, Instant updatedAtDbIdp, User user) { }
        Function<User, UserRecord> toRecord = user -> new UserRecord(
                user.getLastModifiedDate(),
                updatedAt instanceof Instant ? (Instant) updatedAt : Instant.ofEpochSecond((Integer) updatedAt),
                user);
        var user = toUser(principal.getAttributes());
        repository.findOneByEmail(user.getEmail())
                .map(toRecord)
                .filter(r -> r.updatedAtDbIdp().isAfter(r.updatedAtDb()))
                .ifPresentOrElse(r -> update(r.user()), () -> repository.saveAndFlush(user));
    }

    private void update(User other) {
        repository.findOneByEmail(other.getEmail())
                .map(user -> put(user, other))
                .ifPresent(repository::saveAndFlush);
    }

    private User put(User user, User other) {
        user.setEmail(other.getEmail());
        user.setImageUrl(other.getImageUrl());
        user.setLastName(other.getLastName());
        user.setFirstName(other.getFirstName());
        return user;
    }

    private User toUser(Map<String, Object> oauth) {
        var user = new User();
        var givenName = oauth.get("given_name");
        user.setFirstName(givenName != null ? (String) givenName : (String) oauth.get("name"));
        var familyName = oauth.get("family_name");
        if (familyName != null) user.setLastName((String) familyName);
        String sub = String.valueOf(oauth.get("sub"));
        var preferredName = oauth.get("preferred_username");
        String username = preferredName != null ? ((String) preferredName).toLowerCase() : null;
        var email = oauth.get("email");
        user.setEmail(email != null
                ? (String) email : sub.contains("|") && username != null && username.contains("@")
                ? username : sub);
        var picture = oauth.get("picture");
        if (picture != null) user.setImageUrl((String) picture);
        return user;
    }

}
