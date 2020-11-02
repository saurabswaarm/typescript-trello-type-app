    export interface Draggable {
        dragStart(event: Event): void;
        dragEnd(event: Event): void;
    }
    
    export interface Dragarea {
        dragOver(event: Event): void;
        dragLeave(event: Event): void;
        drop(event: Event): void;
    }

//Drag and drop

//The card class should have two methods DragStart and Drag end, implemented by the draggable interface.
//The list needs to have three methods, DragOver, DragLeave, Drop implemented by the dragarea interface.

//As the card is dragged we attach the ID of the project via set data to the drag event.
//When the card is dropped, we see where the card was dropped and then accordingly ask the state manager to update the project
//This fires the listeners again and we get a re-render of the UI