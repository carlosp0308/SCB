package com.example.demo.service;

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
        // Lista auxiliar que va a mantener los contenedores ordenados por peso en orden descendente
        List<Contenedor> contenedoresOrdenados = new ArrayList<>();
    
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
    
        // Recolectar y ordenar los contenedores durante la recorrida de las áreas
        for (Area area : infoAreas.getAreas()) {
            for (Contenedor contenedor : area.getContenedores()) {
                // Insertar el contenedor en la lista auxiliar manteniendo el orden descendente por peso
                insertarOrdenadoPorPeso(contenedoresOrdenados, contenedor);
            }
        }
    
        // Variable para rastrear la posición en la secuencia de áreas
        int secuenciaIndex = 0;
        List<Contenedor> resultContenedores = new ArrayList<>();
    
        // Asignar los contenedores ordenados a las áreas de la secuencia predefinida
        for (Contenedor contenedor : contenedoresOrdenados) {
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
    
    /**
     * Inserta un contenedor en la lista en el lugar adecuado para mantener el orden descendente por peso.
     */
    private void insertarOrdenadoPorPeso(List<Contenedor> lista, Contenedor contenedor) {
        // Realiza una búsqueda para encontrar el lugar donde insertar el nuevo contenedor
        int i = 0;
        while (i < lista.size() && lista.get(i).getPeso() >= contenedor.getPeso()) {
            i++;
        }
        // Insertar el contenedor en la posición correcta
        lista.add(i, contenedor);
    }
    



    public String comprobarDistribucion(InfoAreas infoAreas) {
        double pesoTotal = 0.0;
        double pesoIzquierda = 0.0;
        double pesoDerecha = 0.0;
        double pesoAbajo = 0.0;
        double pesoArriba = 0.0;
        double toleranciaBuque = 300.0;
        
        int equilibrio = 0;  // Variable para almacenar el estado de equilibrio
        
        System.out.println("Iniciando la comprobación de la distribución...");
    
        // Sumar el peso total de todos los contenedores entre las áreas 2 a 79
        for (Area area : infoAreas.getAreas()) {
            if (area.getId() >= 2 && area.getId() <= 79) {
                double pesoArea = 0.0;
    
                // Iterar sobre los contenedores del área para sumar sus pesos
                for (Contenedor contenedor : area.getContenedores()) {
                    pesoArea += contenedor.getPeso();
                }
    
                // Agregar el peso del área al peso total
                pesoTotal += pesoArea;
    
                System.out.println("Área ID: " + area.getId() + ", Peso: " + pesoArea);
    
                // Calcular los pesos multiplicados por sus factores para izquierda/derecha
                if (area.getId() >= 2 && area.getId() <= 14) {
                    pesoIzquierda += pesoArea * -5;
                } else if (area.getId() >= 15 && area.getId() <= 27) {
                    pesoIzquierda += pesoArea * -2.5;
                } else if (area.getId() >= 28 && area.getId() <= 40) {
                    pesoIzquierda += pesoArea * -1.5;
                } else if (area.getId() >= 41 && area.getId() <= 53) {
                    pesoDerecha += pesoArea * 1.5;
                } else if (area.getId() >= 54 && area.getId() <= 66) {
                    pesoDerecha += pesoArea * 2.5;
                } else if (area.getId() >= 67 && area.getId() <= 79) {
                    pesoDerecha += pesoArea * 5;
                }
    
                // Calcular los pesos multiplicados por sus factores para arriba/abajo
                if (List.of(2, 15, 28, 41, 54, 67).contains(area.getId())) {
                    pesoAbajo += pesoArea * 5;
                } else if (List.of(3, 16, 29, 42, 55, 68).contains(area.getId())) {
                    pesoAbajo += pesoArea * 3;
                } else if (List.of(4, 17, 30, 43, 56, 69).contains(area.getId())) {
                    pesoAbajo += pesoArea * 2;
                } else if (List.of(5, 18, 31, 44, 57, 70).contains(area.getId())) {
                    pesoAbajo += pesoArea * 1.5;
                } else if (List.of(6, 19, 32, 45, 58, 71).contains(area.getId())) {
                    pesoAbajo += pesoArea * 1.3;
                } else if (List.of(7, 20, 33, 46, 59, 72).contains(area.getId())) {
                    pesoAbajo += pesoArea * 1.1;
                } else if (List.of(9, 22, 35, 48, 61, 74).contains(area.getId())) {
                    pesoArriba += pesoArea * -1.1;
                } else if (List.of(10, 23, 36, 49, 62, 75).contains(area.getId())) {
                    pesoArriba += pesoArea * -1.3;
                } else if (List.of(11, 24, 37, 50, 63, 76).contains(area.getId())) {
                    pesoArriba += pesoArea * -1.5;
                } else if (List.of(12, 25, 38, 51, 64, 77).contains(area.getId())) {
                    pesoArriba += pesoArea * -2;
                } else if (List.of(13, 26, 39, 52, 65, 78).contains(area.getId())) {
                    pesoArriba += pesoArea * -3;
                } else if (List.of(14, 27, 40, 53, 66, 79).contains(area.getId())) {
                    pesoArriba += pesoArea * -5;
                }
            }
        }




        // Calcular la diferencia entre izquierda y derecha (pesoIzquierda + pesoDerecha)
        double diferenciaIzqDer = pesoIzquierda + pesoDerecha;
    
        // Calcular la diferencia entre arriba y abajo (pesoAbajo + pesoArriba)
        double diferenciaArribaAbajo = pesoAbajo + pesoArriba;
    
        System.out.println("Peso Total: " + pesoTotal);
        System.out.println("Izquierdo - Derecho: " + diferenciaIzqDer);
        System.out.println("Superior - Inferior: " + diferenciaArribaAbajo);
    
        // Evaluar la diferencia izquierda/derecha con margen de tolerancia
      if (Math.abs(diferenciaIzqDer) > (pesoTotal * 0.5 + toleranciaBuque)) {
     // Caso de mayor diferencia (más allá del margen de 50%)
     if (diferenciaIzqDer < -(pesoTotal * 0.5 + toleranciaBuque)) {
        equilibrio += 5;  // Se necesita más peso en el sector derecho
         } else {
        equilibrio += 4;  // Se necesita más peso en el sector izquierdo
        }
         } else if (Math.abs(diferenciaIzqDer) > (pesoTotal * 0.1 + toleranciaBuque)) {
         // Caso de diferencia moderada (más allá del margen de 10%)
        if (diferenciaIzqDer < -(pesoTotal * 0.1 + toleranciaBuque)) {
          equilibrio += 3;  // Se necesita más peso en el sector derecho
        } else {
         equilibrio += 2;  // Se necesita más peso en el sector izquierdo
         }
          } else {
           // Caso de equilibrio óptimo
         equilibrio += 1;  // Distribución óptima
          }

         // Evaluar la diferencia arriba/abajo con margen de tolerancia
         if (Math.abs(diferenciaArribaAbajo) > (pesoTotal * 0.5 + toleranciaBuque)) {
            // Caso de mayor diferencia (más allá del margen de 50%)
            if (diferenciaArribaAbajo < -(pesoTotal * 0.5 + toleranciaBuque)) {
               equilibrio += 50;  // Se necesita más peso en el sector arriba
            } else {
               equilibrio += 40;  // Se necesita más peso en el sector abajo
            }
             } else if (Math.abs(diferenciaArribaAbajo) > (pesoTotal * 0.1 + toleranciaBuque)) {
            // Caso de diferencia moderada (más allá del margen de 10%)
            if (diferenciaArribaAbajo < -(pesoTotal * 0.1 + toleranciaBuque)) {
               equilibrio += 30;  // Se necesita más peso en el sector arriba
            } else {
               equilibrio += 20;  // Se necesita más peso en el sector abajo
            }
              } else {
            // Caso de equilibrio óptimo
             equilibrio += 10;  // Distribución óptima
             }
             System.out.println("Variable equilibrio: " + equilibrio);
    
             // Crear el mensaje basado en el valor de equilibrio y la dirección de la diferencia
             String resultado = "";
             switch (equilibrio) {
            case 11:resultado ="Distribución óptima. El buque puede zarpar sin dificultades.";
            break;
            case 12:resultado ="Distribución aceptable. El buque puede zarpar. Se recomienda colocar mas peso en el sector izquierdo para mejorar la distribución";
            break;
            case 13:resultado ="Distribución aceptable. El buque puede zarpar. Se recomienda colocar mas peso en el sector derecho para mejorar la distribución";
            break;
            case 14:resultado ="Distribución no aceptable. El buque no puede zarpar en estas condiciones.Se recomienda colocar mas peso en el sector izquierdo para mejorar la distribución";
            break;
            case 15:resultado ="Distribución no aceptable.El buque no puede zarpar en estas condiciones.Se recomienda colocar mas peso en el sector derecho para mejorar la distribución";
            break;
            case 21:resultado ="Distribución aceptable.El buque puede zarpar, pero se recomienda colocar mas peso en el sector arriba para mejorar la distribución.";
            break;
            case 22:resultado ="Distribución aceptable.El buque puede zarpar, pero se recomienda colocar mas peso en el sector arriba y el sector izquierdo pra mejorar la distribución";
            break;
            case 23:resultado ="Distribución aceptable.El buque puede zarpar, pero se recomienda colocar mas peso en el sector arriba y el sector derecho pra mejorar la distribución";
            break;
            case 24:resultado ="Distribución no aceptable. El buque no puede zarpar en estas condiciones. Se debe colocar mas peso en el sector arriba y el sector izquierdo para mejorar la distribución";
            break;
            case 25:resultado ="Distribución no aceptable. El buque no puede zarpar en estas condiciones. Se debe colocar mas peso en el sector arriba y el sector derecho para mejorar la distribución";
            break;
            case 31:resultado ="Distribución aceptable.El buque puede zarpar, pero se recomienda colocar mas peso en el sector abajo para mejorar la distribución";
            break;
            case 32:resultado ="Distribución aceptable.El buque puede zarpar, pero se recomienda colocar mas peso en el sector abajo y el sector izquierdo para mejorar la distribución";
            break;
            case 33:resultado ="Distribución aceptable.El buque puede zarpar, pero se recomienda colocar mas peso en el sector abajo y el sector derecho para mejorar la distribución";
            break;
            case 34:resultado ="Distribución no aceptable. El buque no puede zarpar en estas condiciones. Se debe colocar mas peso en el sector abajo y el sector izquierdo para mejorar la distribución";
            break;
            case 35:resultado ="Distribución no aceptable. El buque no puede zarpar en estas condiciones. Se debe colocar mas peso en el sector abajo y el sector derecho para mejorar la distribución";
            break;
            case 41:resultado ="Distribución aceptable.El buque puede zarpar, pero se recomienda colocar mas peso en el sector arriba para mejorar la distribución";
            break;
            case 42:resultado ="Distribución aceptable.El buque puede zarpar, pero se recomienda colocar mas peso en el sector arriba y el sector izquierdo para mejorar la distribución";
            break;
            case 43:resultado ="Distribución aceptable.El buque puede zarpar, pero se recomienda colocar mas peso en el sector arriba y el sector derecho para mejorar la distribución";
            break;
            case 44:resultado ="Distribución no aceptable. El buque no puede zarpar en estas condiciones.Se debe colocar mas peso en el sector arriba y el sector izquierdo para mejorar la distribución";
            break;
            case 45:resultado ="Distribución no aceptable. El buque no puede zarpar en estas condiciones. e debe colocar mas peso en el sector arriba y el sector derecho para mejorar la distribución";
            break;
            case 51:resultado ="Distribución no aceptable.El buque no puede zarpar en estas condiciones.Se debe colocar mas peso en el sector abajo para mejorar la distribución";
            break;
            case 52:resultado ="Distribución no aceptable.El buque no puede zarpar en estas condiciones.Se debe colocar mas peso en el sector abajo y el sector izquierdo para mejorar la distribución";
            break;
            case 53:resultado ="Distribución no aceptable.El buque no puede zarpar en estas condiciones.Se debe colocar mas peso en el sector abajo y el sector derecho para mejorar la distribución";
            break;
            case 54:resultado ="Distribución no aceptable.El buque no puede zarpar en estas condiciones.Se debe colocar mas peso en el sector abajo y el sector izquierdo para mejorar la distribución";
            break;
            case 55:resultado ="Distribución no aceptable.El buque no puede zarpar en estas condiciones.Se debe colocar mas peso en el sector abajo y el sector derecho para mejorar la distribución";
            break;

            default:
                resultado ="Revisar la distribución, el análisis no es concluyente.";
                break;
        }
    
        return resultado;
    }
}