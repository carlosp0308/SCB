package com.example.demo.service;


import java.util.Comparator;  // Para ordenar los contenedores
import java.util.Arrays;      // Para crear la lista de áreas predefinidas
import java.util.Map;         // Para manejar el mapeo de áreas
import java.util.HashMap;     // Para la implementación del mapeo de áreas

import com.example.demo.model.Area;
import com.example.demo.model.Contenedor;
import com.example.demo.model.InfoAreas;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class ReubicacionService {

    private final AreaService areaService;

    public ReubicacionService(AreaService areaService) {
        this.areaService = areaService;
    }

    public List<Contenedor> reubicarContenedores(InfoAreas infoAreas) {
        List<Contenedor> todosContenedores = new ArrayList<>();

        // Recolectar todos los contenedores de las áreas
        for (Area area : infoAreas.getAreas()) {
            todosContenedores.addAll(area.getContenedores());
        }

        // Ordenar los contenedores por peso en orden descendente (de mayor a menor)
        todosContenedores.sort(Comparator.comparingDouble(Contenedor::getPeso).reversed());

        // Secuencia de áreas predefinida
        List<Integer> secuenciaAreas = Arrays.asList(
                47, 34, 33, 48, 35, 46, 45, 36, 49, 32, 31, 50, 37, 44, 43, 38, 30, 51,
                21, 60, 20, 61, 59, 22, 23, 58, 19, 62, 63, 18, 57, 24, 25, 56, 17, 64,
                65, 16, 55, 26, 8, 73, 74, 7, 9, 72, 10, 6, 71, 75, 76, 5, 70, 11, 12,
                69, 4, 77, 52, 29, 42, 39, 68, 13, 78, 3, 40, 41, 28, 53, 15, 66, 54,
                27, 67, 2, 79, 14
        );

        List<Area> predefinedAreas = areaService.getAreas();  // Obtener las áreas definidas con coordenadas
        Map<Integer, Area> areasMap = new HashMap<>();  // Mapa para acceder rápidamente a las áreas por su ID

        for (Area area : predefinedAreas) {
            areasMap.put(area.getId(), area);
        }

        // Variable para rastrear la posición en la secuencia
        int secuenciaIndex = 0;
        List<Contenedor> resultContenedores = new ArrayList<>();

        // Distribuir los contenedores siguiendo la secuencia de áreas
        for (Contenedor contenedor : todosContenedores) {
            int areaId = secuenciaAreas.get(secuenciaIndex);  // Obtener el área en la secuencia
            Area area = areasMap.get(areaId);  // Obtener el área correspondiente

            if (area != null) {
                // Asignar las coordenadas del área al contenedor
                contenedor.setX(area.getX());
                contenedor.setY(area.getY());
                resultContenedores.add(contenedor);
            }

            // Mover al siguiente área en la secuencia (ciclo si se llega al final)
            secuenciaIndex = (secuenciaIndex + 1) % secuenciaAreas.size();
        }

        return resultContenedores;
    }



    public String comprobarDistribucion(InfoAreas infoAreas) {
        double pesoTotal = 0.0;
        double variable2 = 0.0;
        double variable3 = 0.0;
        double variable5 = 0.0;
        double variable6 = 0.0;
    
        System.out.println("Iniciando la comprobación de la distribución...");
    
        // Sumar el peso total de todos los contenedores entre las áreas 2 a 79
        for (Area area : infoAreas.getAreas()) {
            if (area.getId() >= 2 && area.getId() <= 79) {
                double pesoArea = area.getContenedores().stream().mapToDouble(Contenedor::getPeso).sum();
                pesoTotal += pesoArea;
    
                System.out.println("Área ID: " + area.getId() + ", Peso: " + pesoArea);
    
                // Calcular los pesos multiplicados por sus factores para izquierda/derecha
                if (area.getId() >= 2 && area.getId() <= 14) {
                    variable2 += pesoArea * -10;
                } else if (area.getId() >= 15 && area.getId() <= 27) {
                    variable2 += pesoArea * -5;
                } else if (area.getId() >= 28 && area.getId() <= 40) {
                    variable2 += pesoArea * -2.5;
                } else if (area.getId() >= 41 && area.getId() <= 53) {
                    variable3 += pesoArea * 2.5;
                } else if (area.getId() >= 54 && area.getId() <= 66) {
                    variable3 += pesoArea * 5;
                } else if (area.getId() >= 67 && area.getId() <= 79) {
                    variable3 += pesoArea * 10;
                }
    
                // Calcular los pesos multiplicados por sus factores para arriba/abajo
                if (List.of(2, 15, 28, 41, 54, 67).contains(area.getId())) {
                    variable5 += pesoArea * 10;
                } else if (List.of(3, 16, 29, 42, 55, 68).contains(area.getId())) {
                    variable5 += pesoArea * 5;
                } else if (List.of(4, 17, 30, 43, 56, 69).contains(area.getId())) {
                    variable5 += pesoArea * 2.5;
                } else if (List.of(5, 18, 31, 44, 57, 70).contains(area.getId())) {
                    variable5 += pesoArea * 1.5;
                } else if (List.of(6, 19, 32, 45, 58, 71).contains(area.getId())) {
                    variable5 += pesoArea * 1;
                } else if (List.of(7, 20, 33, 46, 59, 72).contains(area.getId())) {
                    variable5 += pesoArea * 0.5;
                } else if (List.of(9, 22, 35, 48, 61, 74).contains(area.getId())) {
                    variable6 += pesoArea * -0.5;
                } else if (List.of(10, 23, 36, 49, 62, 75).contains(area.getId())) {
                    variable6 += pesoArea * -1;
                } else if (List.of(11, 24, 37, 50, 63, 76).contains(area.getId())) {
                    variable6 += pesoArea * -1.5;
                } else if (List.of(12, 25, 38, 51, 64, 77).contains(area.getId())) {
                    variable6 += pesoArea * -2.5;
                } else if (List.of(13, 26, 39, 52, 65, 78).contains(area.getId())) {
                    variable6 += pesoArea * -5;
                } else if (List.of(14, 27, 40, 53, 66, 79).contains(area.getId())) {
                    variable6 += pesoArea * -10;
                }
            }
        }
    
        // Calcular la diferencia entre izquierda y derecha
        double variable4 = variable2 + variable3;
        double diferencia = pesoTotal - variable4;
    
        // Calcular la diferencia entre arriba y abajo
        double variable7 = variable5 + variable6;
        double diferencia2 = pesoTotal - variable7;
    
        System.out.println("Peso Total: " + pesoTotal);
        System.out.println("Variable 2 (lado izquierdo): " + variable2);
        System.out.println("Variable 3 (lado derecho): " + variable3);
        System.out.println("Diferencia calculada (izquierda/derecha): " + diferencia);
    
        System.out.println("Variable 5 (sector superior): " + variable5);
        System.out.println("Variable 6 (sector inferior): " + variable6);
        System.out.println("Diferencia calculada (arriba/abajo): " + diferencia2);
    
        StringBuilder resultado = new StringBuilder();
    
        // Evaluar la diferencia izquierda/derecha
        boolean equilibradoIzqDer = false;
        if (diferencia >= -pesoTotal * 1.1 && diferencia <= pesoTotal * 1.1) {
            equilibradoIzqDer = true;  // Está equilibrado en izquierda/derecha
        } else if (diferencia < -pesoTotal * 1.5) {
            resultado.append("Debe colocar más peso en el sector izquierdo del buque");
        } else {
            resultado.append("Debe colocar más peso en el sector derecho del buque");
        }
    
        // Evaluar la diferencia arriba/abajo
        if (diferencia2 >= -pesoTotal * 1.1 && diferencia2 <= pesoTotal * 1.1) {
            if (equilibradoIzqDer) {
                // Si ambas dimensiones están equilibradas
                resultado.append("La distribución es óptima.");
            }
        } else if (diferencia2 < -pesoTotal * 1.1) {
            if (resultado.length() > 0) {
                resultado.append(" y en el superior del buque.");
            } else {
                resultado.append("Debe colocar más peso en el sector superior del buque.");
            }
        } else {
            if (resultado.length() > 0) {
                resultado.append(" y en el inferior del buque.");
            } else {
                resultado.append("Debe colocar más peso en el sector inferior del buque.");
            }
        }
    
        return resultado.toString();
    }
}    