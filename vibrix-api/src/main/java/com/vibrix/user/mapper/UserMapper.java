package com.vibrix.user.mapper;

import com.vibrix.user.application.dto.ReadUserDTO;
import com.vibrix.user.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    ReadUserDTO toReadUserDTO(User user);
}
