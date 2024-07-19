package com.example.demo.controller;

import com.example.demo.model.Contenedor;
import com.example.demo.model.InfoAreas;
import com.example.demo.service.ReubicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reubicacion")
public class ReubicacionController {

    @Autowired
    private ReubicacionService reubicacionService;

    @PostMapping
    public List<Contenedor> reubicarContenedores(@RequestBody InfoAreas infoAreas) {
        // Log de datos recibidos del frontend
        System.out.println("Datos recibidos del frontend:");
        infoAreas.getAreas().forEach(area -> {
            System.out.println("Area ID: " + area.getId());
            area.getContenedores().forEach(contenedor -> {
                System.out.println("Contenedor ID: " + contenedor.getId() + ", Tipo: " + contenedor.getTipo() + ", Peso: " + contenedor.getPeso());
            });
        });

        List<Contenedor> updatedContenedores = reubicacionService.reubicarContenedores(infoAreas);

        // Log de datos enviados al frontend
        System.out.println("Datos enviados al frontend:");
        updatedContenedores.forEach(contenedor -> {
            System.out.println("Contenedor ID: " + contenedor.getId() + ", X: " + contenedor.getX() + ", Y: " + contenedor.getY());
        });

        return updatedContenedores;
    }
}
