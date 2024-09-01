document.addEventListener("DOMContentLoaded", () => {
    const placaInputs = document.querySelectorAll(
        "#placa, #placaBorrar, #placaBuscar"
    );
    placaInputs.forEach((input) => {
        input.addEventListener("input", () => {
            input.value = input.value.toUpperCase();
        });
    });

    const busForm = document.getElementById("busForm");
    const borrarForm = document.getElementById("borrarForm");
    const buscarForm = document.getElementById("buscarForm");
    const resultado = document.getElementById("resultado");
    const mostrarRegistros = document.getElementById("mostrarRegistros");

    busForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const placa = document.getElementById("placa").value;
        const horaLlegada = document.getElementById("horaLlegada").value;

        fetch("/buses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ placa, horaLlegada }),
        })
            .then((response) => response.text())
            .then((data) => {
                alert(data);
                busForm.reset();
            })
            .catch((error) => console.error("Error:", error));
    });

    borrarForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const placa = document.getElementById("placaBorrar").value;

        fetch(`/buses/${placa}`, {
            method: "DELETE",
        })
            .then((response) => response.text())
            .then((data) => {
                alert(data);
                borrarForm.reset();
            })
            .catch((error) => console.error("Error:", error));
    });

    buscarForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const placa = document.getElementById("placaBuscar").value;

        fetch(`/buses/${placa}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Bus no encontrado.");
                }
                return response.json();
            })
            .then((bus) => {
                const registros = bus.registros
                    .map((reg) => `Orden ${reg.ordenRegistro}: ${reg.horaLlegada}`)
                    .join("<br>");
                resultado.innerHTML = `Placa: ${bus.placa}<br>Registros:<br>${registros}<br>Ediciones: ${bus.ediciones}`;
                buscarForm.reset();
            })
            .catch((error) => {
                console.error("Error:", error);
                resultado.innerHTML = "Bus no encontrado.";
            });
    });

    mostrarRegistros.addEventListener("click", () => {
        fetch("/buses")
            .then((response) => response.json())
            .then((buses) => {
                const registros = buses.buses
                    .map(
                        (bus) =>
                            `Placa: ${bus.placa}<br>` +
                            `Registros:<br>${bus.registros
                                .map((reg) => `Orden ${reg.ordenRegistro}: ${reg.horaLlegada}`)
                                .join("<br>")}<br>` +
                            `Ediciones: ${bus.ediciones}`
                    )
                    .join("<br><br>");
                resultado.innerHTML = registros;
            })
            .catch((error) => {
                console.error("Error:", error);
                resultado.innerHTML = "Error al cargar los registros.";
            });
    });
});
