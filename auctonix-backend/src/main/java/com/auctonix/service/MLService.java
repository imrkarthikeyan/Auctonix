package com.auctonix.service;

import com.auctonix.dto.MLRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MLService {

    private final RestTemplate restTemplate;
    @Value("${ml.service.base-url:http://localhost:8000}")
    private String mlServiceBaseUrl;

    // to call python ml url
    public Map<String, Object> getPrediction(MLRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<MLRequest> entity = new HttpEntity<>(request, headers);
        String mlUrl = mlServiceBaseUrl.replaceAll("/$", "") + "/api/ml/predict";

        log.info("Calling ML service at: {}", mlUrl);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    mlUrl,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {
            }
            );

            log.info("ML service response: {}", response.getStatusCode());
            return response.getBody();
        } catch (Exception ex) {
            log.error("ML service call failed: {}", ex.getMessage(), ex);
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("success", false);
            fallback.put("error", "ML service unavailable");
            fallback.put("details", ex.getMessage());
            return fallback;
        }

    }
}
