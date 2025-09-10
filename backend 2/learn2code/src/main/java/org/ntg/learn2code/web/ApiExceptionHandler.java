package org.ntg.learn2code.web;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestControllerAdvice
class ApiExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> badRequest(MethodArgumentNotValidException ex) {
        var first = ex.getBindingResult().getFieldErrors().stream().findFirst();
        return ResponseEntity.badRequest().body(Map.of(
                "error", "validation_error",
                "message", first.map(f -> f.getField()+": "+f.getDefaultMessage()).orElse("Invalid payload")
        ));
    }
}