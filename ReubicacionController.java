package com.example.demo.controller;

import com.example.demo.model.Contenedor;
import com.example.demo.model.InfoAreas;
import com.example.demo.service.ReubicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.util.Map;
import java.util.HashMap;
import com.example.demo.model.Area;

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
    @PostMapping("/comprobar")
 
     public String comprobarDistribucion(@RequestBody InfoAreas infoAreas) {
        // Llamar al método del servicio que comprueba la distribución
        String resultado = reubicacionService.comprobarDistribucion(infoAreas);

        // Retornar el resultado como texto al frontend
        return resultado;
    }
}