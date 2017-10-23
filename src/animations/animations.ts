
import {
    trigger,
    animate,
    style,
    state,
    transition
} from '@angular/core';

export const CardAnimation = trigger('cardUsed', [
    
    state('hide', style({transform: 'translateY(100%)'})),
    state('reveal', style({transform: 'translateY(0)'})),
    transition('hide => reveal', [
      animate('400ms ease-in-out')
    ])
  ]);

  export const InputAnimation =   trigger('inputAnim', [
    state('reveal', style({transform: 'scale(1.0)'})),
    transition('void => reveal', [
      style({backgroundColor:'rgba(46, 204, 113,0.8)', transform: 'scale(1.1)'}),
      animate('300ms ease-in-out')
    ])
  ]);

