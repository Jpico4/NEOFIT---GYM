const db = window.firebaseDb;
const { collection, addDoc, getDocs } = window.firebaseFirestore;

// Inicializa Firebase
const form = document.getElementById('registerForm');
const registrationSection = document.getElementById('registrationSection');
const selectionSection = document.getElementById('selectionSection');
const statusMessage = document.getElementById('statusMessage');
const nextBtn = document.getElementById('nextBtn');
const saveSelectionButton = document.getElementById('saveSelection');
const downloadDBButton = document.getElementById('downloadDB');

// Variables para guardar temporalmente los datos del usuario
let usuarioTemp = {};

// Evento: Botón "Siguiente"
nextBtn.addEventListener('click', () => {
    const fullName = document.getElementById('fullName').value;
    const age = document.getElementById('age').value;
    const birthDate = document.getElementById('birthDate').value;
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;

    if (fullName && age && birthDate && weight && height) {
        usuarioTemp = {
            nombreCompleto: fullName,
            edad: age,
            fechaNacimiento: birthDate,
            peso: weight,
            altura: height
        };
        statusMessage.textContent = '';
        form.reset();
        registrationSection.style.display = 'none';
        selectionSection.style.display = 'block';
        window.scrollTo({ top: selectionSection.offsetTop, behavior: 'smooth' });
    } else {
        statusMessage.textContent = 'Por favor, completa todos los campos.';
        statusMessage.style.color = 'red';
    }
});

// Evento: Guardar selección de preferencias
saveSelectionButton.addEventListener('click', async () => {
    const routineType = document.getElementById('routineType').value;
    const classType = document.getElementById('classType').value;
    const mealPlan = document.getElementById('mealPlan').value;

    if (routineType && classType && mealPlan) {
        try {
            // Guarda usuario
            const userRef = await addDoc(collection(db, 'usuarios'), usuarioTemp);
            // Guarda selección y referencia al usuario
            await addDoc(collection(db, 'selecciones'), {
                tipoRutina: routineType,
                tipoClase: classType,
                planAlimentacion: mealPlan,
                usuarioId: userRef.id
            });
            statusMessage.textContent = 'Selección guardada exitosamente.';
            statusMessage.style.color = 'green';
        } catch (error) {
            statusMessage.textContent = 'Error al guardar selección.';
            statusMessage.style.color = 'red';
        }
    } else {
        statusMessage.textContent = 'Por favor, selecciona todas las opciones.';
        statusMessage.style.color = 'red';
    }
});

// Evento: Descargar base de datos en JSON
downloadDBButton.addEventListener('click', async () => {
    async function getCollectionData(collectionName) {
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    try {
        const usuarios = await getCollectionData('usuarios');
        const selecciones = await getCollectionData('selecciones');
        const data = { usuarios, selecciones };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'base_de_datos.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        statusMessage.textContent = 'Error al descargar la base de datos.';
        statusMessage.style.color = 'red';
    }
});