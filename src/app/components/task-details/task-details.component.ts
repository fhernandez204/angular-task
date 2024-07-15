import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent {
  @Input() viewMode = false;

  @Input() currentTask: Task = {
    title: '',
    description: '',
    completed: false
  };

  message = '';

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getTask(this.route.snapshot.params['id']);
    }
  }

  getTask(id: string): void {
    this.taskService.get(id).subscribe({
      next: (data) => {
        this.currentTask = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  updatePublished(status: boolean): void {
    const data = {
      title: this.currentTask.title,
      description: this.currentTask.description,
      completed: status
    };

    this.message = '';

    this.taskService.update(this.currentTask.id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.currentTask.completed = status;
        this.message = res.message
          ? res.message
          : 'Modificado Satisfactoriamente!';
      },
      error: (e) => console.error(e)
    });
  }

  updateTask(): void {
    this.message = '';

    this.taskService
      .update(this.currentTask.id, this.currentTask)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message
            ? res.message
            : 'Esta Tarea fue Modificada Correctamente!';
        },
        error: (e) => console.error(e)
      });
  }

  deleteTask(): void {
    this.taskService.delete(this.currentTask.id).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/tasks']);
      },
      error: (e) => console.error(e)
    });
  }
}
