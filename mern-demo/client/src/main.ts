const appDiv = document.querySelector<HTMLDivElement>('#app')!;
const API_URL = 'https://silver-space-palm-tree-xrvww7vw5pjp364rx-5000.app.github.dev/api/students';

let studentsList: any[] = [];

// 1. Hàm render giao diện ứng dụng
function renderApp() {
  appDiv.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h2>Thêm Sinh Viên Mới</h2>
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

        <button type="submit" style="padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">
          Thêm Sinh Viên
        </button>
      </form>

      <h2>Danh Sách Sinh Viên</h2>
      <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>STT</th>
            <th>Mã SV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          ${studentsList.map((sv, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${sv.studentId || ''}</td>
              <td>${sv.name || ''}</td>
              <td>${sv.email || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Gán sự kiện submit cho form
  const form = document.getElementById('studentForm') as HTMLFormElement;
  form.addEventListener('submit', handleFormSubmit);
}

// 2. Hàm lấy danh sách sinh viên từ Backend (GET)
async function fetchStudents() {
  try {
    const response = await fetch(API_URL);
    studentsList = await response.json();
    renderApp();
  } catch (error) {
    appDiv.innerHTML = `<p style="color: red;">Lỗi khi tải dữ liệu: ${error}</p>`;
  }
}

// 3. CÂU 49: Hàm gửi dữ liệu sinh viên mới lên Backend (POST)
async function handleFormSubmit(e: Event) {
  e.preventDefault();

  // Lấy giá trị từ các ô input
  const studentId = (document.getElementById('studentId') as HTMLInputElement).value;
  const name = (document.getElementById('name') as HTMLInputElement).value;
  const email = (document.getElementById('email') as HTMLInputElement).value;

  const newStudent = { studentId, name, email };

  try {
    // Gọi API POST /api/students
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent),
    });

    if (response.ok) {
      alert('Thêm sinh viên thành công!');
      // Tải lại danh sách sinh viên mới cập nhật từ MongoDB
      fetchStudents();
    } else {
      const errorData = await response.json();
      alert(`Lỗi khi thêm: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Lỗi gửi request:', error);
    alert('Không thể kết nối đến máy chủ.');
  }
}

// Chạy ứng dụng
fetchStudents();