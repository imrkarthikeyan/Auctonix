package com.auctonix.controller;

import com.auctonix.dto.MLRequest;
import com.auctonix.service.MLService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ml")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class MLContoller {
    private final MLService mlService;

    // to get ml prediction
    @PostMapping("/predict")
    public ResponseEntity<Map<String, Object>> predict(@RequestBody MLRequest request) {
        Map<String, Object> prediction = mlService.getPrediction(request);
        return ResponseEntity.ok(prediction);
    }
}
