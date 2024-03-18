import { Task } from "./task";
import i18n from './i18n';

const section = ui.createProjectPanelSection();

let requestId;

data.onProjectSelect.subscribe(async project => {
    section.removeAllChildren();

    if (project) {
        const currentRequestId = requestId = Math.random();

        const tasks: Task[] = await project.storage.organization.read<Task[]>('todo') || [];

        if (requestId != currentRequestId) {
            return;
        }
    
        const nameTextField = new ui.TextField('', '', i18n.Name());
        section.add(nameTextField);
    
        const createButton = new ui.Button(ui.icons.plus, i18n.Create_Task(), async () => {
            const task = new Task(nameTextField.value);
            
            tasks.unshift(task);
            
            await project.storage.organization.write('todo', tasks);

            const firstChild = tasksContainer.children[0];

            if (firstChild) {
                tasksContainer.insertBefore(renderTask(task), firstChild);
            } else {
                tasksContainer.add(renderTask(task));
            }
        });

        section.add(createButton);
    
        section.add(new ui.Separator());

        const renderTask = (task) => {
            const checkbox = new ui.Checkbox(task.name, false);

            checkbox.onValueChange.subscribe(async () => {
                if (task.done) {
                    return;
                }

                task.done = true;
        
                await project.storage.organization.write('todo', tasks);
        
                Timer.timeout(() => checkbox.parent?.remove(checkbox), 250);
            });

            return checkbox;
        };

        const tasksContainer = new ui.Container();
        section.add(tasksContainer);
    
        for (let task of tasks) {
            if (!task.done) {
                tasksContainer.add(renderTask(task));
            }
        }
    }
});