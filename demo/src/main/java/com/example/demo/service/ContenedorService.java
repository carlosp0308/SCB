package com.example.demo.service;

import com.example.demo.model.Contenedor;
import com.example.demo.repository.ContenedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContenedorService {

    @Autowired
    private ContenedorRepository contenedorRepository;

    public List<Contenedor> getAllContenedores() {
        return contenedorRepository.findAll();
    }

    // Método para obtener contenedores por sus coordenadas (si fuera necesario)
    public List<Contenedor> getContenedoresByCoordenadas(double x, double y) {
        return contenedorRepository.findAll().stream()
                .filter(c -> c.getX() == x && c.getY() == y)
                .toList();
    }

    // Método para guardar o actualizar un contenedor
    public Contenedor saveContenedor(Contenedor contenedor) {
        return contenedorRepository.save(contenedor);
    }

    // Método para obtener el peso total de los contenedores
    public double getTotalPeso() {
        return contenedorRepository.findAll()
                .stream()
                .mapToDouble(Contenedor::getPeso)
                .sum();
    }
}
