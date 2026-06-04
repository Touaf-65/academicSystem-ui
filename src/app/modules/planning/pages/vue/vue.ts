import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { ScheduleModel, CreateScheduleRequest, ScheduleService } from '../../services/planning/planning-service';
import { ClassModel, ClassService } from '../../../department/services/class/class-service';
import { CourseModel, CourseService } from '../../../course/services/course/course-service';
import { TeacherModel, TeacherService } from '../../../teacher/services/teacher/teacher-service';
import { RoomModel, RoomService } from '../../../infrastructure/services/room/room-service';
import { GroupModel, GroupService } from '../../../schooling/services/group/group-service';

type TabKey = 'class' | 'teacher' | 'room' | 'group';
type ViewMode = 'week' | 'month';
type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

interface WeekDay {
  shortName: string;
  date: Date;
  dayKey: DayOfWeek;
}

interface TimeSlot {
  hour: number;
  label: string;
  showLabel: boolean;
}

interface ScheduleForm {
  classId: number | null;
  courseId: number | null;
  teacherId: number | null;
  roomId: number | null;
  groupId: number | null;
  sessionType: 'COURSE' | 'TD' | 'TP' | 'EXAM';
  dayOfWeek: DayOfWeek;
  semester: number;
  startTime: string;
  endTime: string;
  academicYear: string;
}

@Component({
  standalone: true,
  selector: 'app-vue',
  imports: [CommonModule, FormsModule, ModalComponent, NotificationComponent, DatePipe],
  templateUrl: './vue.html',
  styleUrl: './vue.scss',
})
export class Vue implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private scheduleService: ScheduleService,
    private classService: ClassService,
    private courseService: CourseService,
    private teacherService: TeacherService,
    private roomService: RoomService,
    private groupService: GroupService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ── Data ──────────────────────────────────────────────────────────────────
  schedules: ScheduleModel[] = [];
  filteredSchedules: ScheduleModel[] = [];
  classes: ClassModel[] = [];
  courses: CourseModel[] = [];
  teachers: TeacherModel[] = [];
  rooms: RoomModel[] = [];
  groups: GroupModel[] = [];

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabs = [
    { key: 'class' as TabKey, label: 'Par classe' },
    { key: 'teacher' as TabKey, label: 'Par enseignant' },
    { key: 'room' as TabKey, label: 'Par salle' },
    { key: 'group' as TabKey, label: 'Par groupe' },
  ];
  activeTab: TabKey = 'class';

  // ── Filter ────────────────────────────────────────────────────────────────
  selectedFilterId: number | null = null;
  get filterOptions(): { id: number; label: string }[] {
    switch (this.activeTab) {
      case 'class':   return this.classes.map(c => ({ id: c.id, label: c.nom }));
      case 'teacher': return this.teachers.map(t => ({ id: t.id, label: t.nom }));
      case 'room':    return this.rooms.map(r => ({ id: r.id, label: r.nom }));
      case 'group':   return this.groups.map(g => ({ id: g.id, label: g.nom }));
    }
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.selectedFilterId) {
      this.filteredSchedules = [...this.schedules];
      return;
    }
    switch (this.activeTab) {
      case 'class':
        this.filteredSchedules = this.schedules.filter(s => s.classId === this.selectedFilterId);
        break;
      case 'teacher':
        this.filteredSchedules = this.schedules.filter(s => s.teacherId === this.selectedFilterId);
        break;
      case 'room':
        this.filteredSchedules = this.schedules.filter(s => s.roomId === this.selectedFilterId);
        break;
      case 'group':
        this.filteredSchedules = this.schedules.filter(s => s.groupId === this.selectedFilterId);
        break;
    }
    this.cdr.detectChanges();
  }

  // ── View mode ─────────────────────────────────────────────────────────────
  viewMode: ViewMode = 'week';

  // ── Week navigation ───────────────────────────────────────────────────────
  currentMonday: Date = this.getMonday(new Date());

  get currentWeekLabel(): string {
    const end = new Date(this.currentMonday);
    end.setDate(end.getDate() + 5);
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return `${this.currentMonday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('fr-FR', opts)}`;
  }

  get weekDays(): WeekDay[] {
    const dayKeys: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const shortNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return dayKeys.map((key, i) => {
      const d = new Date(this.currentMonday);
      d.setDate(d.getDate() + i);
      return { shortName: shortNames[i], date: d, dayKey: key };
    });
  }

  get timeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    for (let h = 7; h <= 19; h++) {
      slots.push({ hour: h, label: `${h.toString().padStart(2, '0')}:00`, showLabel: true });
      slots.push({ hour: h + 0.5, label: '', showLabel: false });
    }
    return slots;
  }

  previousWeek(): void {
    const d = new Date(this.currentMonday);
    d.setDate(d.getDate() - 7);
    this.currentMonday = d;
  }

  nextWeek(): void {
    const d = new Date(this.currentMonday);
    d.setDate(d.getDate() + 7);
    this.currentMonday = d;
  }

  goToToday(): void {
    this.currentMonday = this.getMonday(new Date());
  }

  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate()
      && date.getMonth() === today.getMonth()
      && date.getFullYear() === today.getFullYear();
  }

  // ── Month view ────────────────────────────────────────────────────────────
  get monthWeeks(): (Date | null)[][] {
    const year = this.currentMonday.getFullYear();
    const month = this.currentMonday.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Mon=0

    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = Array(startDow).fill(null);

    for (let d = 1; d <= lastDay.getDate(); d++) {
      week.push(new Date(year, month, d));
      if (week.length === 6) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 6) week.push(null);
      weeks.push(week);
    }
    return weeks;
  }

  getSchedulesForDate(date: Date): ScheduleModel[] {
    const dayKey = this.dateToDayKey(date);
    return this.filteredSchedules.filter(s => s.dayOfWeek === dayKey);
  }

  private dateToDayKey(date: Date): DayOfWeek {
    const map: DayOfWeek[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return map[date.getDay()];
  }

  // ── Timetable helpers ──────────────────────────────────────────────────────
  getSchedulesForSlot(dayKey: DayOfWeek, slotHour: number): ScheduleModel[] {
    return this.filteredSchedules.filter(s => {
      if (s.dayOfWeek !== dayKey) return false;
      const startH = this.timeToHour(s.startTime);
      return Math.floor(startH * 2) === Math.floor(slotHour * 2);
    });
  }

  getSessionHeight(s: ScheduleModel): number {
    const start = this.timeToHour(s.startTime);
    const end = this.timeToHour(s.endTime);
    const duration = end - start; // in hours
    return Math.max(duration * 80, 60); // 80px per hour, min 60px
  }

  getSessionColorClass(type: string): string {
    switch (type) {
      case 'COURSE': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-800 dark:text-blue-200';
      case 'TD':     return 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-200';
      case 'TP':     return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200';
      case 'EXAM':   return 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200';
      default:       return 'bg-gray-50 border-gray-400 text-gray-800';
    }
  }

  private timeToHour(time: any): number {
    if (!time) return 0;
    if (typeof time === 'string') {
      const [h, m] = time.split(':').map(Number);
      return h + (m || 0) / 60;
    }
    if (typeof time === 'object' && 'hours' in time) {
      return time.hours + (time.minutes || 0) / 60;
    }
    return 0;
  }

  formatTime(time: any): string {
    if (!time) return '';
    if (typeof time === 'string') return time.substring(0, 5);
    if (typeof time === 'object' && 'hours' in time) {
      return `${String(time.hours).padStart(2, '0')}:${String(time.minutes || 0).padStart(2, '0')}`;
    }
    return '';
  }

  // ── Lookup helpers ─────────────────────────────────────────────────────────
  getCourseName(id: number): string {
    return this.courses.find(c => c.id === id)?.name ?? `Cours #${id}`;
  }

  getTeacherName(id: number): string {
    const t = this.teachers.find(t => t.id === id);
    return t ? `Pr. ${t.nom}` : `Ens. #${id}`;
  }

  getRoomName(id: number): string {
    return this.rooms.find(r => r.id === id)?.nom ?? `Salle #${id}`;
  }

  getGroupName(id: number): string {
    return this.groups.find(g => g.id === id)?.nom ?? `Groupe #${id}`;
  }

  getDayLabel(day: DayOfWeek): string {
    const map: Record<DayOfWeek, string> = {
      MONDAY: 'Lundi', TUESDAY: 'Mardi', WEDNESDAY: 'Mercredi',
      THURSDAY: 'Jeudi', FRIDAY: 'Vendredi', SATURDAY: 'Samedi', SUNDAY: 'Dimanche',
    };
    return map[day] ?? day;
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.scheduleService.getSchedules().subscribe({
      next: data => { this.schedules = data; this.filteredSchedules = data; this.cdr.detectChanges(); },
    });
    this.classService.getClasss().subscribe({ next: data => { this.classes = data; this.cdr.detectChanges(); } });
    this.courseService.getCourses().subscribe({ next: data => { this.courses = data; this.cdr.detectChanges(); } });
    this.teacherService.getTeachers().subscribe({ next: data => { this.teachers = data; this.cdr.detectChanges(); } });
    this.roomService.getRooms().subscribe({ next: data => { this.rooms = data; this.cdr.detectChanges(); } });
    this.groupService.getGroups().subscribe({ next: data => { this.groups = data; this.cdr.detectChanges(); } });
  }

  private emptyForm(): ScheduleForm {
    return {
      classId: null, courseId: null, teacherId: null, roomId: null, groupId: null,
      sessionType: 'COURSE', dayOfWeek: 'MONDAY', semester: 1,
      startTime: '08:00', endTime: '10:00', academicYear: '2025-2026',
    };
  }

  private formToPayload(f: ScheduleForm): CreateScheduleRequest {
    return {
      classId: f.classId!,
      courseId: f.courseId!,
      teacherId: f.teacherId!,
      roomId: f.roomId!,
      groupId: f.groupId!,
      sessionType: f.sessionType,
      dayOfWeek: f.dayOfWeek,
      semester: f.semester,
      startTime: f.startTime as any,
      endTime: f.endTime as any,
      academicYear: f.academicYear,
    };
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────
  createSchedule(): void {
    this.scheduleService.createSchedule(this.formToPayload(this.form)).subscribe({
      next: () => {
        this.notificationService.success('Séance créée', 'La séance a été créée avec succès !');
        this.form = this.emptyForm();
        this.loadAll();
        this.modalCreateOpen = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la création.');
        this.modalCreateOpen = false;
      },
    });
  }

  editSchedule(): void {
    this.scheduleService.updateSchedule(this.scheduleToEdit!.id, this.formToPayload(this.editForm)).subscribe({
      next: () => {
        this.notificationService.success('Séance modifiée', 'La séance a été modifiée avec succès !');
        this.loadAll();
        this.closeModalEditSchedule();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la modification.');
        this.closeModalEditSchedule();
      },
    });
  }

  deleteSchedule(): void {
    this.scheduleService.deleteSchedule(this.scheduleToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success('Séance supprimée', 'La séance a été supprimée avec succès !');
        this.loadAll();
        this.closeModalDeleteSchedule();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la suppression.');
        this.closeModalDeleteSchedule();
      },
    });
  }

  // ── Modals: Create ────────────────────────────────────────────────────────
  modalCreateOpen = false;
  form: ScheduleForm = this.emptyForm();

  openModalCreateSchedule(): void { this.form = this.emptyForm(); this.modalCreateOpen = true; }
  closeModalCreateSchedule(): void { this.modalCreateOpen = false; }

  // ── Modals: View ──────────────────────────────────────────────────────────
  modalViewOpen = false;
  scheduleToView: ScheduleModel | null = null;

  openModalViewSchedule(s: ScheduleModel): void { this.scheduleToView = s; this.modalViewOpen = true; }
  closeModalViewSchedule(): void { this.modalViewOpen = false; this.scheduleToView = null; }

  // ── Modals: Edit ──────────────────────────────────────────────────────────
  modalEditOpen = false;
  scheduleToEdit: ScheduleModel | null = null;
  editForm: ScheduleForm = this.emptyForm();

  openEditSchedule(s: ScheduleModel): void {
    this.scheduleToEdit = s;
    this.editForm = {
      classId: s.classId,
      courseId: s.courseId,
      teacherId: s.teacherId,
      roomId: s.roomId,
      groupId: s.groupId,
      sessionType: s.sessionType,
      dayOfWeek: s.dayOfWeek,
      semester: s.semester,
      startTime: this.formatTime(s.startTime),
      endTime: this.formatTime(s.endTime),
      academicYear: s.academicYear,
    };
    this.modalEditOpen = true;
  }

  closeModalEditSchedule(): void {
    this.modalEditOpen = false;
    this.scheduleToEdit = null;
    this.editForm = this.emptyForm();
  }

  // ── Modals: Delete ────────────────────────────────────────────────────────
  modalDeleteOpen = false;
  scheduleToDelete: ScheduleModel | null = null;

  openDeleteSchedule(s: ScheduleModel): void { this.scheduleToDelete = s; this.modalDeleteOpen = true; }
  closeModalDeleteSchedule(): void { this.modalDeleteOpen = false; this.scheduleToDelete = null; }
}
