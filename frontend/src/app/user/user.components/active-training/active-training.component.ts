import { Component, OnInit } from '@angular/core';
import { ActiveTrainingService } from './active-training.service';

@Component({
    selector: 'app-active-training',
    templateUrl: 'active-training.component.html',
    styleUrls: ['active-training.component.scss'],
    providers: [
        ActiveTrainingService
    ]
})

export class ActiveTrainingComponent implements OnInit {
    // global
    loaded: boolean;
    secundomerBind = {
        intervalTrain: false,
        finishTrain: <boolean | string>false
    };
    userMeasures: any;
    intervalCache = [
        {
            lapTime: 151413,
            warmTime: 12154
        },
        {
            lapTime: 5142,
            warmTime: 33254
        },
        {
            lapTime: 23,
            warmTime: 1242
        },
        {
            lapTime: 12546,
            warmTime: 1245
        },
        {
            lapTime: 5142,
            warmTime: 33254
        },
        {
            lapTime: 23,
            warmTime: 1242
        }
    ];

    trainingPlan: any;

    // child bind
    burnedCallories = 1445;

    constructor(
        private activeTrainingService: ActiveTrainingService
    ) {}

    ngOnInit() {
        this.activeTrainingService.getMeasures((data) => {
            this.userMeasures = data;
        });

        this.activeTrainingService.getPlans((plan) => {
            if (!plan) {
                this.loaded = false;
                return;
            }
            this.trainingPlan = plan;
            this.loaded = true;
        });
    }

    choosePlan() {
        this.activeTrainingService.getPlans((plan) => {
            if (plan === undefined) {
                return;
            }
            this.trainingPlan = plan;
            this.loaded = true;
        });
    }
    onStart() {
        this.activeTrainingService.addTraining(this.trainingPlan, (result) => {
            if (result) {
                this.trainingPlan._id = result;
                console.log(this.trainingPlan);
            }
        });
    }

    onFinish(timeData) {
        const data = {
            time: timeData,
            calories: this.burnedCallories,
        };
        this.activeTrainingService.showFinishDialog(data, this.trainingPlan, result => {
            if (result) {
                this.secundomerBind.finishTrain = true;
            } else {
                this.secundomerBind.finishTrain = 'continue';
            }
            setTimeout(() => { this.secundomerBind.finishTrain = false; }, 1000);
        });
    }

    onChangeList(updatedList) {
        this.trainingPlan.exercisesList = updatedList;
        if (this.trainingPlan._id) {
            this.activeTrainingService.updateTraining(this.trainingPlan);
        }
    }
}
