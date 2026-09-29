import React, { useState, useEffect } from 'react';

const API_URL = 'https://friendly-umbrella-gx7qqj7q4p75c99xv-5000.app.github.dev/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    maSV: '',
    hoTen: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);

  // =========================
  // LẤY DANH SÁCH SINH VIÊN
  // =========================
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      console.log('Danh sách sinh viên:', data);

      setStudents(data);
    } catch (err) {
      console.error('Lỗi tải danh sách:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // THÊM / CẬP NHẬT SINH VIÊN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (editingId) {
        // CẬP NHẬT
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        });
      } else {
        // THÊM
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        });
      }

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      setEditingId(null);
      setForm({
        maSV: '',
        hoTen: '',
        email: ''
      });

      await fetchStudents();

    } catch (err) {
      console.error('Lỗi gửi dữ liệu:', err);
    }
  };

  // =========================
  // SỬA SINH VIÊN
  // =========================
  const handleEdit = (st) => {
    setEditingId(st._id);

    setForm({
      maSV: st.maSV || st.masv || st.studentId || st.ma_sv || st.code || '',
      hoTen: st.hoTen || st.hoten || st.name || st.fullName || '',
      email: st.email || ''
    });
  };

  // =========================
  // XÓA SINH VIÊN
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      await fetchStudents();

    } catch (err) {
      console.error('Lỗi xóa sinh viên:', err);
    }
  };

  // =========================
  // HỦY CHỈNH SỬA
  // =========================
  const handleCancel = () => {
    setEditingId(null);

    setForm({
      maSV: '',
      hoTen: '',
      email: ''
    });
  };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* =========================
          FORM SINH VIÊN
      ========================= */}
      <h2 style={{ textAlign: 'center' }}>
        {editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên Mới'}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}
      >
        {/* Mã sinh viên */}
        <div style={{ marginBottom: '10px' }}>
          <label>
            <b>Mã Sinh Viên:</b>
          </label>

          <input
            type="text"
            required
            value={form.maSV}
            onChange={(e) =>
              setForm({
                ...form,
                maSV: e.target.value
              })
            }
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Họ tên */}
        <div style={{ marginBottom: '10px' }}>
          <label>
            <b>Họ và Tên:</b>
          </label>

          <input
            type="text"
            required
            value={form.hoTen}
            onChange={(e) =>
              setForm({
                ...form,
                hoTen: e.target.value
              })
            }
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '10px' }}>
          <label>
            <b>Email:</b>
          </label>

          <input
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Nút */}
        <button
          type="submit"
          style={{
            background: '#00c853',
            color: '#fff',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            style={{
              marginLeft: '10px',
              background: '#888',
              color: '#fff',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Hủy
          </button>
        )}
      </form>

      {/* =========================
          DANH SÁCH SINH VIÊN
      ========================= */}
      <h2
        style={{
          textAlign: 'center',
          marginTop: '40px'
        }}
      >
        Danh Sách Sinh Viên
      </h2>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left'
        }}
        border="1"
        cellPadding="10"
      >
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th
              style={{
                textAlign: 'center',
                width: '60px'
              }}
            >
              STT
            </th>

            <th
              style={{
                textAlign: 'center',
                width: '100px'
              }}
            >
              Mã SV
            </th>

            <th style={{ textAlign: 'left' }}>
              Họ và Tên
            </th>

            <th style={{ textAlign: 'left' }}>
              Email
            </th>

            <th
              style={{
                textAlign: 'center',
                width: '140px'
              }}
            >
              Hành động
            </th>
          </tr>
        </thead>

        <tbody>
          {students.map((st, index) => (
            <tr key={st._id || index}>
              <td style={{ textAlign: 'center' }}>
                {index + 1}
              </td>

              <td style={{ textAlign: 'center' }}>
                {st.maSV ||
                  st.masv ||
                  st.studentId ||
                  st.ma_sv ||
                  st.code ||
                  ''}
              </td>

              <td>
                {st.hoTen ||
                  st.hoten ||
                  st.name ||
                  st.fullName ||
                  ''}
              </td>

              <td>
                {st.email || ''}
              </td>

              <td
                style={{
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <button
                  onClick={() => handleEdit(st)}
                  style={{
                    background: '#5c5bf6',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '8px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  Sửa
                </button>

                <button
                  onClick={() => handleDelete(st._id)}
                  style={{
                    background: '#e91e63',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;