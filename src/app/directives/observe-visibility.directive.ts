import {
  Directive,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { Subject, delay, filter } from 'rxjs';
import { PostInterface } from '../models/post.interface';

@Directive({
  selector: '[observeVisibility]',
})
export class ObserveVisibilityDirective
  implements OnDestroy, OnInit, AfterViewInit
{
  // Input decorator to specify the debounce time for the visibility check
  @Input() debounceTime = 0;
  // Input decorator to specify the threshold for the visibility check
  @Input() threshold = 1;
  // Input decorator to specify the post data
  @Input() post = {} as PostInterface;
  // Output decorator to emit the post data when the element is visible
  @Output() visible = new EventEmitter<PostInterface>();
  // Private variable to store the IntersectionObserver instance
  private observer: IntersectionObserver | undefined;
  // Private variable to store the Subject instance for the visibility check
  private subject$ = new Subject<{
    entry: IntersectionObserverEntry;
    observer: IntersectionObserver;
  }>();

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.createObserver();
  }

  ngAfterViewInit() {
    this.startObservingElements();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }

    //this.subject$.next();
    this.subject$.complete();
  }

  private isVisible(element: HTMLElement) {
    return new Promise((resolve) => {
      const observer = new IntersectionObserver(([entry]) => {
        //resolve(entry.intersectionRatio === 1);
        const isEndInViewport =
          entry.isIntersecting &&
          entry.boundingClientRect.bottom <= entry.rootBounds!.bottom;
        resolve(isEndInViewport);
        observer.disconnect();
      });

      observer.observe(element);
    });
  }

  private createObserver() {
    const options = {
      rootMargin: '0px',
      threshold: this.threshold,
    };

    const isIntersecting = (entry: IntersectionObserverEntry) =>
      entry.isIntersecting || entry.intersectionRatio > 0;

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (isIntersecting(entry)) {
          this.subject$.next({ entry, observer });
        }
      });
    }, options);
  }
  // Helper function that starts observing the element by calling observe on the IntersectionObserver instance
  // and subscribing to the Subject instance to detect when the element is intersecting with the viewport
  private startObservingElements() {
    if (!this.observer) {
      return;
    }

    this.observer.observe(this.element.nativeElement);

    this.subject$
      .pipe(delay(this.debounceTime), filter(Boolean))
      .subscribe(async ({ entry, observer }) => {
        const target = entry.target as HTMLElement;
        const isStillVisible = await this.isVisible(target);

        if (isStillVisible) {
          this.visible.emit(this.post);
          observer.unobserve(target);
          //here i can remove the visited element
        }
      });
  }
}
