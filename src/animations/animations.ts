
import {
    trigger,
    animate,
    style,
    state,
    transition
} from '@angular/core';


import {query, stagger} from '@angular/animations';

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

  export const MapAnimation =   trigger
  (
    'mapAnim', [
      transition(':enter', [
        style({height:'0px', opacity: 0, minHeight:0}),
        animate('300ms ease-in-out', style( {  height:'*',opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('300ms ease-in-out', style({height:'0px', opacity: 0, minHeight:0}))
      ])
    ]
  );
