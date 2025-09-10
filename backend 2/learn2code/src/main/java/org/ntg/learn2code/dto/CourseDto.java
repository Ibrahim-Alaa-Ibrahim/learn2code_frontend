package org.ntg.learn2code.dto;

import java.math.BigDecimal;

public record CourseDto(
        Long id,
        String title,
        String description,
        BigDecimal price
) {}
