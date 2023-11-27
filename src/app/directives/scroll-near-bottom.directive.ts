import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[scrollNearBottom]',
})
//This directive watches the container to check if it gets to near bottom
export class ScrollNearBottomDirective {
  // Private variable to store the last state of the "near bottom" event
  lastState: boolean = false;
  // Output decorator to emit the "near bottom" event
  @Output() nearBottom: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    // Get the current scroll position
    const scrollPosition = window.innerHeight + window.scrollY;
    // Get the total height of the page
    const totalHeight = document.body.offsetHeight;
    // Determine if the user is near the bottom of the viewport
    const nearBottom = scrollPosition > totalHeight * 0.9;

    // Emit the "near bottom" event if the state has changed
    if (this.lastState != nearBottom) this.nearBottom.emit(nearBottom);
    this.lastState = nearBottom;
  }
}
