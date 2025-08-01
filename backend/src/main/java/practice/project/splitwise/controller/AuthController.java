package practice.project.splitwise.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import practice.project.splitwise.model.Users;
import practice.project.splitwise.repository.UserRepo;
import practice.project.splitwise.service.JwtUtil;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Users user) {
        System.out.println("Register request received: " + user); // Debug log
        
        if (userRepo.findByMail(user.getMail()).isPresent()) {
            System.out.println("Email already exists: " + user.getMail()); // Debug log
            return ResponseEntity.badRequest().body("Email already in use");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        System.out.println("Encoded password: " + user.getPassword()); // Debug log
        
        Users savedUser = userRepo.save(user);
        System.out.println("User saved successfully: " + savedUser); // Debug log
        
        // Verify the user was actually saved by trying to retrieve it
        Users retrievedUser = userRepo.findByMail(user.getMail()).orElse(null);
        System.out.println("Retrieved user after save: " + retrievedUser); // Debug log
        
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.get("mail"),
                            loginRequest.get("password")
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtil.generateToken(authentication.getName());
            
            // Get user data using the authenticated username (email)
            String authenticatedEmail = authentication.getName();
            Users user = userRepo.findByMail(authenticatedEmail).orElse(null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            
            if (user != null) {
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("name", user.getName());
                userData.put("email", user.getMail());
                response.put("user", userData);
            } else {
                return ResponseEntity.status(500).body("User data not found");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
    
    @GetMapping("/debug/user/{email}")
    public ResponseEntity<?> debugUser(@PathVariable String email) {
        Users user = userRepo.findByMail(email).orElse(null);
        if (user != null) {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("name", user.getName());
            userData.put("email", user.getMail());
            return ResponseEntity.ok(userData);
        } else {
            return ResponseEntity.ok("User not found");
        }
    }
    

} 