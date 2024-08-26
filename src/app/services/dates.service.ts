import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Date } from '../models/Date';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Citas } from '../models/Citas';

@Injectable({
  providedIn: 'root'

})
export class DatesService {
  // API_URI = 'http://localhost:3000  para frontend
  API_URI = 'https://citasmedicas-ten.vercel.app/api'; // Cambiado para usar backend

  constructor(private http: HttpClient) { }

  // Método para guardar un hospitall
  guardarHospital(hospital: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.API_URI}/registrar-hospital`, hospital, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  procesarPago(tarjeta: any): Observable<any> {
    return this.http.post<any>(`${this.API_URI}/registrar-pagos`, tarjeta);
  }

  getDates(): Observable<Date[]> {
    return this.http.get<Date[]>(`${this.API_URI}/dates`).pipe(
      tap(dates => console.log('Fechas obtenidas:', dates)),
      catchError(this.handleError)
    );
  }

  getDate(id: string): Observable<Date> {
    return this.http.get<Date>(`${this.API_URI}/dates/${id}`).pipe(
      tap(date => console.log('Fecha obtenida:', date)),
      catchError(this.handleError)
    );
  }

  saveDate(date: Date): Observable<any> {
    console.log('Enviando solicitud de registro:', date);
    return this.http.post(`${this.API_URI}/register`, date).pipe(
      catchError(this.handleError)
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.API_URI}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: { correo: string; contrase: string }): Observable<any> {
    return this.http.post(`${this.API_URI}/login`, credentials).pipe(
      catchError(this.handleError)
    );
  }

  authenticate(correo: string, contrase: string): Observable<{ isAuthenticated: boolean; userId?: string; userName?: string }> {
    return this.http.post<{ isAuthenticated: boolean; userId?: string; userName?: string }>(`${this.API_URI}/auth`, { correo, contrase }).pipe(
      tap(response => console.log('Autenticación:', response)),
      catchError(this.handleError)
    );
  }

  saveCita(cita: Citas): Observable<any> {
    return this.http.post(`${this.API_URI}/citas`, cita);
  }

  getAllCitas(): Observable<Citas[]> {
    return this.http.get<Citas[]>(`${this.API_URI}/citas`);
  }

  downloadCitasAsJson(citas: Citas[]): void {
    const data = JSON.stringify(citas, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'citas.xls';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error ${error.status}, mensaje: ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Para ver las citas médicas y el historial de citas
  registrarCita(cita: any): Observable<any> {
    return this.http.post(`${this.API_URI}/citas`, cita);
  }

  getCitasPaciente(idPaciente: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URI}/citas/${idPaciente}`);
  }

  getCitasByPaciente(idPaciente: string): Observable<Citas[]> {
    return this.http.get<Citas[]>(`${this.API_URI}/citas/${idPaciente}`).pipe(
      map(citas => citas.map(cita => ({
        ...cita,
        especialidad: cita.especialidad || 'No especificada',
        hospital: cita.hospital || 'No especificada',
        duracionEstimada: cita.duracionEstimada || '30 minutos',
        telefonoMedico: cita.telefonoMedico || 'No disponible',
        correoMedico: cita.correoMedico || 'No disponible',
        puedeModificar: cita.estado === 'pendiente',
        estaFinalizada: cita.estado === 'finalizada'
      })))
    );
  }

  // Modificación de citas y cancelaciones por parte de los pacientes
  updateCita(cita: Citas): Observable<any> {
    return this.http.put(`${this.API_URI}/citas/${cita.idcita}`, cita);
  }

  deleteCita(idCita: number): Observable<any> {
    return this.http.delete(`${this.API_URI}/citas/${idCita}`);
  }

  // Métodos para médicos
  medicoLogin(correo: string, id: string): Observable<any> {
    return this.http.post(`${this.API_URI}/medico-login`, { correo, id }).pipe(
      tap(response => console.log('Login de médico:', response)),
      catchError(this.handleError)
    );
  }


  // Para confirmar citas y enviar historial médico
  confirmarCita(idCita: number): Observable<any> {
    return this.http.put(`${this.API_URI}/citas/${idCita}/confirmar`, {});
  }

  finalizarCita(idCita: number, historialMedico: any): Observable<any> {
    return this.http.post(`${this.API_URI}/citas/${idCita}/finalizar`, historialMedico);
  }




  // Obtener historial médico de un paciente


 

  getCitasByMedico(medicoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URI}/citas-medico/${medicoId}`).pipe(
      tap(citas => console.log('Citas obtenidas:', citas)),
      catchError(this.handleError)
    );
  }
  getHistorialMedico(idPaciente: string): Observable<any> {
    console.log('Solicitando historial médico para el paciente:', idPaciente);
    return this.http.get(`${this.API_URI}/historial-medico/${idPaciente}`).pipe(
      tap(historial => console.log('Historial médico obtenido:', historial)),
      catchError(this.handleError)
    );
  }

  actualizarHistorial(idHistorial: string, historial: any): Observable<any> {
    return this.http.put(`${this.API_URI}/historial-medico/${idHistorial}`, historial).pipe(
      catchError(this.handleError)
    );
  }

  eliminarHistorial(idHistorial: string): Observable<any> {
    return this.http.delete(`${this.API_URI}/historial-medico/${idHistorial}`).pipe(
      catchError(this.handleError)
    );
  }

  
}

  
    