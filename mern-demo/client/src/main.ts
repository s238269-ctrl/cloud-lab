const appDiv = document.querySelector<HTMLDivElement>('#app')!;
const API_URL = 'http://localhost:5000/api/students';

let studentsList: any[] = [];
let editingStudentId: string | null = null;

function renderApp() {
  appDiv.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h2>${editingStudentId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên Mới'}</h2>
      <form id="studentForm" style="margin-bottom: 30px; padding: 15px; border: 1px solid #ccc; border-radius: 5px;">
        <div style="margin-bottom: 10px;">
          <label style="display: block; margin-bottom: 5px;">Mã Sinh Viên:</label>
          <input type="text" id="studentId" required style="width: 100%; padding: 8px; box-sizing: border-box;" />
        </div>
        
        <div style="margin-bottom: 10px;">
          <label style="display: block; margin-bottom: 5px;">Họ và Tên:</label>
          <input type="text" id="name" required style="width: 100%; padding: 8px; box-sizing: border-box;" />
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">Email:</label>
          <input type="email" id="email" required style="width: 100%; padding: 8px; box-sizing: border-box;" />
        </div>

        <button type="submit" style="padding: 10px 20px; background-color: ${editingStudentId ? '#ffc107' : '#28a745'}; color: ${editingStudentId ? 'black' : 'white'}; border: none; border-radius: 3px; cursor: pointer;">
          ${editingStudentId ? 'Cập Nhật' : 'Thêm Sinh Viên'}
        </button>
        ${editingStudentId ? `<button type="button" id="cancelBtn" style="margin-left: 10px; padding: 10px 20px;">Hủy</button>` : ''}
      </form>

      <h2>Danh Sách Sinh Viên</h2>
      <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>STT</th>
            <th>Mã SV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${studentsList.map((sv, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${sv.studentId || ''}</td>
              <td>${sv.name || ''}</td>
              <td>${sv.email || ''}</td>
              <td>
                <button onclick="editStudent('${sv._id}', '${sv.studentId}', '${sv.name}', '${sv.email}')" style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px;">Sửa</button>
                <button onclick="deleteStudent('${sv._id}')" style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Xóa</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  const form = document.getElementById('studentForm') as HTMLFormElement;
  form.addEventListener('submit', handleFormSubmit);

  if (editingStudentId) {
    document.getElementById('cancelBtn')?.addEventListener('click', () => {
      editingStudentId = null;
      renderApp();
    });
  }
}

async function fetchStudents() {
  try {
    const response = await fetch(API_URL);
    studentsList = await response.json();
    renderApp();
  } catch (error) {
    appDiv.innerHTML = `<p style="color: red;">Lỗi khi tải dữ liệu: ${error}</p>`;
  }
}

(window as any).editStudent = (id: string, studentId: string, name: string, email: string) => {
  editingStudentId = id;
  renderApp();
  (document.getElementById('studentId') as HTMLInputElement).value = studentId;
  (document.getElementById('name') as HTMLInputElement).value = name;
  (document.getElementById('email') as HTMLInputElement).value = email;
};

// Hàm xử lý Xóa sinh viên
(window as any).deleteStudent = async (id: string) => {
  if (confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Xóa thành công!');
        fetchStudents();
      } else {
        alert('Xóa thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
    }
  }
};

async function handleFormSubmit(e: Event) {
  e.preventDefault();

  const studentId = (document.getElementById('studentId') as HTMLInputElement).value;
  const name = (document.getElementById('name') as HTMLInputElement).value;
  const email = (document.getElementById('email') as HTMLInputElement).value;

  const payload = { studentId, name, email };

  try {
    const url = editingStudentId ? `${API_URL}/${editingStudentId}` : API_URL;
    const method = editingStudentId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert(editingStudentId ? 'Cập nhật thành công!' : 'Thêm thành công!');
      editingStudentId = null;
      fetchStudents();
    } else {
      alert('Có lỗi xảy ra!');
    }
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

fetchStudents();