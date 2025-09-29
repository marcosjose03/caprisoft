package com.caprisoft.caprisoft.dto;

import com.caprisoft.caprisoft.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private String token;
    private Long userId;
    private String fullName;
    private Role role;
}
