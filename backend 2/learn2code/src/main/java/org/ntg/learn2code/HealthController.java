package org.ntg.learn2code;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;                     // ✅ بدل jakarta ب javax
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")                       // ✅ إصلاح الأنوتيشن
public class HealthController {

    private final JdbcTemplate jdbc;
    private final DataSource ds;

    public HealthController(JdbcTemplate jdbc, DataSource ds) {
        this.jdbc = jdbc;
        this.ds = ds;
    }

    @GetMapping
    public Map<String, Object> ok() {
        return Map.of("ok", true, "name", "Learn2Code API");
    }

    @GetMapping("/db")
    public ResponseEntity<?> db() {
        try {
            Integer one = jdbc.queryForObject("select 1", Integer.class);
            return ResponseEntity.ok(Map.of("db", (one != null && one == 1) ? "up" : "down"));
        } catch (Exception e) {
            Map<String, Object> out = new LinkedHashMap<>();
            out.put("db", "down");
            out.put("error", e.getClass().getSimpleName());
            out.put("message", String.valueOf(e.getMessage()));
            // ✅ بدون كاست مباشر
            if (ds instanceof HikariDataSource h) {
                out.put("url", h.getJdbcUrl());
                out.put("user", h.getUsername());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(out);
        }
    }
}
