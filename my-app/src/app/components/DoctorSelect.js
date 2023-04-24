export default function DoctorSelect({ doctor, estudio, pacienteChangeHandler }) {
    if (estudio === 'ecografia') {
        return (
            <div className="form-section">
                <span>Doctor:</span>
                <select value={doctor} onChange={e => pacienteChangeHandler('doctor', e.target.value)}>
                    <option value=""></option>
                    <option value="Leonardo">Leonardo</option>
                    <option value="Carla">Carla</option>
                </select>
            </div>
        )
    }
}