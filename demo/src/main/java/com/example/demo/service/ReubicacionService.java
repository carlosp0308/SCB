package com.example.demo.service;

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
        List<Area> predefinedAreas = areaService.getAreas();  // Obtener las áreas definidas con coordenadas
        List<Contenedor> todosContenedores = new ArrayList<>();

        // Recolectar todos los contenedores de las áreas
        for (Area area : infoAreas.getAreas()) {
            if (area.getId() != 1) {  // Omitir el área 1
                todosContenedores.addAll(area.getContenedores());
            }
        }

        // Eliminar todos los contenedores del área 1
        Area area1 = infoAreas.getAreas().stream()
                .filter(a -> a.getId() == 1)
                .findFirst()
                .orElse(null);

        if (area1 != null) {
            todosContenedores.addAll(area1.getContenedores());
            area1.getContenedores().clear();
        }

        // Distribuir los contenedores entre las áreas 2 a 29
        List<Contenedor> resultContenedores = new ArrayList<>();
        int totalContenedores = todosContenedores.size();
        int areasCount = predefinedAreas.size() - 1;  // Excluir el área 1

        int contenedoresPorArea = totalContenedores / areasCount;
        int contenedoresRestantes = totalContenedores % areasCount;

        int index = 0;
        for (Area predefinedArea : predefinedAreas) {
            if (predefinedArea.getId() == 1) {
                continue;  // Omitir el área 1
            }

            int contenedoresAsignados = contenedoresPorArea + (contenedoresRestantes > 0 ? 1 : 0);
            contenedoresRestantes--;

            for (int i = 0; i < contenedoresAsignados && index < totalContenedores; i++) {
                Contenedor contenedor = todosContenedores.get(index++);
                contenedor.setX(predefinedArea.getX());
                contenedor.setY(predefinedArea.getY());
                resultContenedores.add(contenedor);
            }
        }

        return resultContenedores;
    }
}
