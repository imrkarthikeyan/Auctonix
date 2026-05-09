package com.auctonix.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file)
            throws IOException {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Image file is required");
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get("uploads/images/" + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());

        return ResponseEntity.ok("/uploads/images/" + fileName);
    }

    @PostMapping("/pdf")
    public ResponseEntity<String> uploadPdf(@RequestParam("file") MultipartFile file)
            throws IOException {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("pdf file is required");
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get("uploads/pdfs/" + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());

        return ResponseEntity.ok("/uploads/pdfs/" + fileName);
    }
}
