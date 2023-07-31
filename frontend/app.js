
    // Función para obtener todos los estudiantes desde el backend
    async function getStudents() {
      const response = await fetch('/api/read');
      return await response.json();
    }
    
    // Función para buscar un estudiante por ID (Manual)
    async function searchStudent() {
      const searchIdEstudiante = document.getElementById('searchIdEstudiante').value;
      if (!searchIdEstudiante) {
        alert('Please enter an ID to search.');
        return;
      }

      // Get all students and filter the one that matches the search ID
      const students = await getStudents();
      const matchedStudent = students.find((student) => student.student.ID === searchIdEstudiante);

      if (matchedStudent) {
        // Show only the matched student in the table
        const studentsTableBody = document.getElementById('studentsTableBody');
        studentsTableBody.innerHTML = '';

        const row = document.createElement('tr');
        row.setAttribute('data-manual-id', matchedStudent.student.ID);
        row.innerHTML = `
          <td>${matchedStudent.id}</td>
          <td>${matchedStudent.student.ID}</td>
          <td>${matchedStudent.student.name}</td>
          <td>${matchedStudent.student.age}</td>
          <td>${matchedStudent.student.grade}</td>
          <td class="actions">
            <button class="edit-button" onclick="prepareEditStudent('${matchedStudent.id}', '${matchedStudent.student.ID}')">Edit</button>
            <button class="delete-button" onclick="deleteStudent('${matchedStudent.id}')">Delete</button>
          </td>
        `;
        studentsTableBody.appendChild(row);
      } else {
        alert('No student found with the provided ID.');
      }
    }

    // Cargar estudiantes al cargar la página
    //loadStudents();
    

    // Función para crear o actualizar un estudiante
    async function createOrUpdateStudent() {
      const idEstudiante = document.getElementById('idEstudiante').value;
      const name = document.getElementById('name').value;
      const age = parseInt(document.getElementById('age').value);
      const grade = document.getElementById('grade').value;

      if (!idEstudiante || !name || isNaN(age) || !grade) {
        alert('Please enter valid data for the student.');
        return;
      }

      // Check if the student exists in the database based on the manual ID
      const response = await fetch(`/api/read/${idEstudiante}`);
      const existingStudent = await response.json();

      if (existingStudent && existingStudent.length > 0) {
        // If student exists, update the student
        const currentStudent = existingStudent[0].student;

        // Check if any fields are different
        const hasChanges =
          name !== currentStudent.name ||
          age !== currentStudent.age ||
          grade !== currentStudent.grade;

        if (hasChanges) {
          const updatedFields = {
            name: name !== currentStudent.name ? name : currentStudent.name,
            age: age !== currentStudent.age ? age : currentStudent.age,
            grade: grade !== currentStudent.grade ? grade : currentStudent.grade,
          };

          const updateData = { student: updatedFields };
          const updateResponse = await fetch(`/api/update/${existingStudent[0].id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          });

          if (updateResponse.ok) {
            alert('Student updated successfully.');
            // Clear the input fields
            document.getElementById('idEstudiante').value = '';
            document.getElementById('name').value = '';
            document.getElementById('age').value = '';
            document.getElementById('grade').value = '';
            // Refresh the students table
            loadStudents();
          } else {
            alert('Error updating student.');
          }
        } else {
          alert('No changes to update.');
        }
      } else {
        // If student does not exist, create a new student
        const createData = { student: { ID: idEstudiante, name, age, grade } };
        const createResponse = await fetch('/api/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createData),
        });

        if (createResponse.ok) {
          alert('Student created successfully.');
          // Clear the input fields
          document.getElementById('idEstudiante').value = '';
          document.getElementById('name').value = '';
          document.getElementById('age').value = '';
          document.getElementById('grade').value = '';
          // Refresh the students table
          loadStudents();
        } else {
          alert('Error creating student.');
        }
      }
    }

    // Función para preparar datos para editar un estudiante
    function prepareEditStudent(firebaseId, manualId) {
      const nameInput = document.getElementById('name');
      const ageInput = document.getElementById('age');
      const gradeInput = document.getElementById('grade');

      // Fill the input fields with the data of the student being edited
      document.getElementById('idEstudiante').value = manualId;

      // Find the row that corresponds to the student being edited
      const row = document.querySelector(`tr[data-manual-id="${manualId}"]`);
      nameInput.value = row.querySelector('td:nth-child(3)').innerText;
      ageInput.value = row.querySelector('td:nth-child(4)').innerText;
      gradeInput.value = row.querySelector('td:nth-child(5)').innerText;
    }

    // Función para eliminar un estudiante
    async function deleteStudent(firebaseId) {
      const response = await fetch(`/api/delete/${firebaseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the students table
        loadStudents();
      } else {
        alert('Error deleting student.');
      }
    }

     // Función para cargar todos los estudiantes en la tabla
  async function loadStudents() {
    const studentsTableBody = document.getElementById('studentsTableBody');
    studentsTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar los estudiantes

    const students = await getStudents();
    students.forEach((student) => {
      const row = document.createElement('tr');
      row.setAttribute('data-manual-id', student.student.ID);
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.student.ID}</td>
        <td>${student.student.name}</td>
        <td>${student.student.age}</td>
        <td>${student.student.grade}</td>
        <td class="actions">
          <button class="edit-button" onclick="prepareEditStudent('${student.id}', '${student.student.ID}')">Edit</button>
          <button class="delete-button" onclick="deleteStudent('${student.id}')">Delete</button>
        </td>
      `;
      studentsTableBody.appendChild(row);
    });
  }

  // Cargar estudiantes al cargar la página
  loadStudents();
 