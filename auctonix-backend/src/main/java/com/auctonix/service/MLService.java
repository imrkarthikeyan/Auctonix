package com.auctonix.service;

import com.auctonix.dto.MLRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class MLService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String ML_API_BASE_URL = "http://localhost:5000/api/ml"; // Python ML microservice URL
    // to call python ml url
    public Map<String, Object> getPrediction(MLRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<MLRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                ML_API_BASE_URL + "/predict",
                HttpMethod.POST,
                entity,
                Map.class
        );

        return response.getBody();
    }
}
