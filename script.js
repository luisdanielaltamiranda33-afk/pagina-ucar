
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const corteCalculator = document.getElementById('corte-calculator');
    const semestreCalculator = document.getElementById('semestre-calculator');
    const views = [welcomeScreen, corteCalculator, semestreCalculator];

    const btnCorte = document.getElementById('btn-corte');
    const btnSemestre = document.getElementById('btn-semestre');
    const backButtons = document.querySelectorAll('.back-btn');

    const formCorte = document.getElementById('form-corte');
    const resultCorte = document.getElementById('result-corte');
    const notasContainer = document.getElementById('notas-container');
    const notasActualesInput = document.getElementById('notas-actuales-corte');

    const formSemestre = document.getElementById('form-semestre');
    const resultSemestre = document.getElementById('result-semestre');

    // --- NAVEGACIÓN ENTRE VISTAS ---
    const showView = (viewToShow) => {
        views.forEach(view => view.classList.remove('active'));
        viewToShow.classList.add('active');
    };

    btnCorte.addEventListener('click', () => showView(corteCalculator));
    btnSemestre.addEventListener('click', () => showView(semestreCalculator));

    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Limpiar todo al volver al menú
            resultCorte.style.display = 'none';
            resultSemestre.style.display = 'none';
            formCorte.reset();
            formSemestre.reset();
            notasContainer.innerHTML = '';
            showView(welcomeScreen);
        });
    });

    // --- LÓGICA PARA EL CÁLCULO DEL CORTE ---

    // Genera los campos de nota dinámicamente
    notasActualesInput.addEventListener('input', () => {
        const totalNotas = parseInt(document.getElementById('total-notas-corte').value);
        const notasActuales = parseInt(notasActualesInput.value);
        notasContainer.innerHTML = ''; // Limpia el contenedor

        if (isNaN(notasActuales) || notasActuales <= 0 || isNaN(totalNotas) || notasActuales > totalNotas) {
            return;
        }

        for (let i = 1; i <= notasActuales; i++) {
            const div = document.createElement('div');
            div.classList.add('input-group');
            div.innerHTML = `
                <label for="corte-nota-${i}">Ingresa la calificación ${i}:</label>
                <input type="number" id="corte-nota-${i}" step="0.01" min="0" max="5" required>
            `;
            notasContainer.appendChild(div);
        }
    });

    formCorte.addEventListener('submit', (e) => {
        e.preventDefault();
        const B = parseInt(document.getElementById('total-notas-corte').value); // Total de notas
        const C = parseInt(document.getElementById('notas-actuales-corte').value); // Notas que tiene
       
        let suma = 0;
        for (let i = 1; i <= C; i++) {
            const nota = parseFloat(document.getElementById(`corte-nota-${i}`).value);
            if(isNaN(nota) || nota < 0 || nota > 5) {
                alert("Por favor, ingresa notas válidas entre 0.0 y 5.0.");
                return;
            }
            suma += nota;
        }

        const CN1 = 3.0 * B; // Suma total necesaria para aprobar con 3.0
        const CN2 = CN1 - suma; // Suma necesaria en las notas faltantes

        const notasFaltantes = B - C;

        if (notasFaltantes <= 0) {
            const promedioFinal = suma / B;
            if (promedioFinal >= 3.0) {
                displayResult(resultCorte, `¡Felicidades! 🎉 Has completado todas tus notas y tu promedio es <strong>${promedioFinal.toFixed(2)}</strong>. ¡Corte aprobado!`, 'success');
            } else {
                displayResult(resultCorte, `Has completado todas tus notas. Tu promedio final es <strong>${promedioFinal.toFixed(2)}</strong>. ¡Mucho ánimo para el próximo corte!`, 'danger');
            }
            return;
        }

        if (CN2 <= 0) {
            displayResult(resultCorte, `¡Excelente! 🚀 Ya tienes los puntos necesarios para aprobar el corte. ¡Sigue así!`, 'success');
        } else {
            const promedioNecesario = CN2 / notasFaltantes;
            if (promedioNecesario > 5.0) {
                displayResult(resultCorte, `Necesitas un promedio de <strong>${promedioNecesario.toFixed(2)}</strong> en tus notas restantes, lo cual no es posible. 😥 ¡No te desanimes y da lo mejor en el siguiente corte!`, 'danger');
            } else {
                displayResult(resultCorte, `¡Ánimo! 💪 Para aprobar, necesitas que el promedio de tus <strong>${notasFaltantes}</strong> notas restantes sea al menos <strong>${promedioNecesario.toFixed(2)}</strong>.`, 'warning');
            }
        }
    });

    // --- LÓGICA PARA EL CÁLCULO DEL SEMESTRE ---
    formSemestre.addEventListener('submit', (e) => {
        e.preventDefault();
        const c1 = parseFloat(document.getElementById('sem-corte1').value);
        const c2 = parseFloat(document.getElementById('sem-corte2').value);
        const c3 = parseFloat(document.getElementById('sem-corte3').value);

        if (isNaN(c1) || isNaN(c2) || isNaN(c3) || c1 < 0 || c1 > 5 || c2 < 0 || c2 > 5 || c3 < 0 || c3 > 5) {
            alert("Por favor, ingresa las tres notas de corte válidas.");
            return;
        }

        const promedioCortes = (c1 + c2 + c3) / 3;
        // Fórmula del PSeInt: NE = (3.0 - (Promedio * 0.60)) / 0.40
        const notaExamenFinal = (3.0 - (promedioCortes * 0.60)) / 0.40;

        if (notaExamenFinal > 5.0) {
            displayResult(resultSemestre, `La nota mínima que necesitas en el examen final es <strong>${notaExamenFinal.toFixed(2)}</strong>. Lamentablemente, no es posible alcanzarla. ¡Prepárate con todo para la próxima!`, 'danger');
        } else if (notaExamenFinal <= 0) {
            displayResult(resultSemestre, `¡Felicidades! 🥳 Ya tienes el semestre aprobado. Solo necesitas presentar el examen final. ¡A cerrar con broche de oro!`, 'success');
        } else {
            displayResult(resultSemestre, `¡Ya casi es tuyo! ✨ Para aprobar el semestre, necesitas sacar al menos <strong>${notaExamenFinal.toFixed(2)}</strong> en el examen final.`, 'warning');
        }
    });
   
    // --- FUNCIÓN PARA MOSTRAR RESULTADOS ---
    const displayResult = (element, message, type) => {
        element.innerHTML = message;
        element.className = 'result-display'; // Resetea clases
        element.classList.add(type);
        element.style.display = 'block';
    };
});