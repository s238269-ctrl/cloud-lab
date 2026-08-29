import React, { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ maSV: '', hoTen: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Lỗi tải danh sách:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`http://localhost:5000/api/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          setEditingId(null);
          setForm({ maSV: '', hoTen: '', email: '' });
          fetchStudents();
        }
      } else {
        const res = await fetch('http://localhost:5000/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          setForm({ maSV: '', hoTen: '', email: '' });
          fetchStudents();
        }
      }
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
    }
  };

  const handleEdit = (st) => {
    setEditingId(st._id);
    setForm({
      maSV: st.maSV || st.masv || st.studentId || st.ma_sv || st.code || '',
      hoTen: st.hoTen || st.hoten || st.name || st.fullName || '',
      email: st.email || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      try {
        await fetch(`http://localhost:5000/api/students/${id}`, {
          method: 'DELETE'
        });
        fetchStudents();
      } catch (err) {
        console.error("Lỗi xóa sinh viên:", err);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Thêm Sinh Viên Mới</h2>
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <div style={{ marginBottom: '10px' }}>
          <label><b>Mã Sinh Viên:</b></label>
          <input
            type="text"
            required
            value={form.maSV}
            onChange={(e) => setForm({ ...form, maSV: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label><b>Họ và Tên:</b></label>
          <input
            type="text"
            required
            value={form.hoTen}
            onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label><b>Email:</b></label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ background: '#00c853', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setForm({ maSV: '', hoTen: '', email: '' }); }}
            style={{ marginLeft: '10px', background: '#888', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Hủy
          </button>
        )}
      </form>

      <h2 style={{ textAlign: 'center', marginTop: '40px' }}>Danh Sách Sinh Viên</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} border="1" cellPadding="10">
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={{ textAlign: 'center', width: '60px' }}>STT</th>
            <th style={{ textAlign: 'center', width: '100px' }}>Mã SV</th>
            <th style={{ textAlign: 'left' }}>Họ và Tên</th>
            <th style={{ textAlign: 'left' }}>Email</th>
            <th style={{ textAlign: 'center', width: '140px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((st, index) => (
            <tr key={st._id || index}>
              <td style={{ textAlign: 'center' }}>{index + 1}</td>
              <td style={{ textAlign: 'center' }}>
                {st.maSV || st.masv || st.studentId || st.ma_sv || st.code || ''}
              </td>
              <td>{st.hoTen || st.hoten || st.name || st.fullName || ''}</td>
              <td>{st.email || ''}</td>
              <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
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
