import { Task } from "./task";

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
    
        const nameTextField = new ui.TextField('', '', 'Name...');
        section.add(nameTextField);
    
        const createButton = new ui.Button(ui.icons.plus, 'Create Task'.translate.german('Aufgabe Erstellen'), async () => {
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
            const section = new ui.Section(task.name);
            section.createAction(ui.icons.check, 'Complete Task', async () => {
                task.done = true;
        
                await project.storage.organization.write('todo', tasks);
        
                tasksContainer.remove(section);
            });
        
            return section;
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