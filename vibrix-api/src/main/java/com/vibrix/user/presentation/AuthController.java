package com.vibrix.user.presentation;

import com.vibrix.user.application.UserService;
import com.vibrix.user.application.dto.ReadUserDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.MessageFormat;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final UserService service;
    private final ClientRegistration registration;

    public AuthController(UserService service, ClientRegistrationRepository registrations) {
        this.service = service;
        this.registration = registrations.findByRegistrationId("okta");
    }

    @GetMapping("/authuser")
    public ResponseEntity<ReadUserDTO> get(@AuthenticationPrincipal OAuth2User principal) {
        service.sync(principal);
        return ResponseEntity.ok().body(service.get());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        var origin = request.getHeader(HttpHeaders.ORIGIN);
        var issuer = registration.getProviderDetails().getIssuerUri();
        Object[] params = { issuer, registration.getClientId(), origin };
        request.getSession().invalidate();
        return ResponseEntity.ok().body(Map.of("logoutUrl", MessageFormat.format("{0}v2/logout?client_id={1}&returnTo={2}", params)));
    }
}
