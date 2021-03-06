import { GoalService } from './goal.service';
import { MdDialogRef, MdDialog } from '@angular/material';
import { GoalEditDialogComponent } from '../goal-edit-dialog/goal-edit-dialog.component';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-goal',
    templateUrl: './goal.component.html',
    styleUrls: ['./goal.component.scss'],
    providers: [GoalService]
})
export class GoalComponent implements OnInit {


    dialogRef: MdDialogRef<any>;
    private data: any[] = [];
    private itemsDropped: any[] = [];
    private cacheLength: number = 0;
    dragOptions = {
        animation: 200,
        ghostClass: 'ghost',
        filter: '.add-container',
        group: 'goals',
        forceFallback: true,
        onEnd: () => {
            if (this.cacheLength < this.itemsDropped.length) {
                this.cacheLength = this.itemsDropped.length;
                console.log(this.itemsDropped);
                this.goalService.deleteGoal(this.itemsDropped[0], () => {
                    console.log('Goal is removed');
                });
            }
        }
    };

    constructor(private dialog: MdDialog, private goalService: GoalService) { }

    ngOnInit() {
        this.goalService.getData((data) => {
            if (data.length === 1 && !data[0]._id) {
                data = [];
            }
            this.data = data;
        });
    }


    deleteGoal(item, event) {
        this.data = this.data.filter((elem) => {
            return elem._id !== item._id;
        });
        this.goalService.deleteGoal(item, () => {
            console.log('Goal is removed');
        });
        event.stopPropagation();
    }


    openDialog(item) {
        this.dialogRef = this.dialog.open(GoalEditDialogComponent, {
            data: {
                item: item,
            }
        });


        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.goalService.getData((data) => {
                    if (data.length === 1 && !data[0]._id) {
                        data = [];
                    }
                    this.data = data;
                });
            }
        });
    }
}
