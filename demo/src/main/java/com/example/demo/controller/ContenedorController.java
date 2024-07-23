package com.example.demo.controller;

import com.example.demo.model.Contenedor;
import com.example.demo.service.ContenedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contenedores")
public class ContenedorController {

    @Autowired
    private ContenedorService contenedorService;

    @GetMapping
    public List<Contenedor> getAllContenedores() {
        return contenedorService.getAllContenedores();
    }

    @PostMapping
    public Contenedor createContenedor(@RequestBody Contenedor contenedor) {
        return contenedorService.saveContenedor(contenedor);
    }
}
