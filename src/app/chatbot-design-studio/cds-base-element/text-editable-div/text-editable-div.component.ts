import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TiledeskVarSplitter } from 'app/chatbot-design-studio/TiledeskVarSplitter';
import { LoggerService } from 'app/services/logger/logger.service';

@Component({
  selector: 'text-editable-div',
  templateUrl: './text-editable-div.component.html',
  styleUrls: ['./text-editable-div.component.scss']
})
export class TextEditableDivComponent implements OnInit, OnChanges  {
  
  @Input() text: string;
  @Output() textChanged = new EventEmitter();

  isOpenSetAttributesPanel: boolean = false
  constructor(
    private logger: LoggerService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    console.log("[TEXT-EDITABLE-DIV] ngOnChanges: text", this.text)
    const splits = new TiledeskVarSplitter().getSplits(this.text);
    console.log('[TEXT-EDITABLE-DIV] ngOnChanges splits:', splits)
    let tagName = ''
    let tagNameAsTag = ''
    let newSplitsArray = [];
    let fommattedActionSubject = ''
    splits.forEach(element => {
      if (element.type === 'tag') {
        tagName = '${' + element.name + '}';
        tagNameAsTag = `<div tag="true" contenteditable="false"  style=" font-weight: 400;font-family: 'ROBOTO'; background: #ffdc66;cursor: pointer;-webkit-transition: all 0.3s;  transition: all 0.3s; border-radius: 10px;-webkit-box-decoration-break: clone; box-decoration-break: clone; display: inline; padding: 0 5px;">${tagName}</div>`
        newSplitsArray.push(tagNameAsTag)

      } else if (element.type === 'text') {
        newSplitsArray.push(element.text)
      }
    });
    console.log('[TEXT-EDITABLE-DIV]  newSplitsArray', newSplitsArray)

    newSplitsArray.forEach(element => {
      fommattedActionSubject += element

    });
    console.log('[TEXT-EDITABLE-DIV]  fommattedActionSubject', fommattedActionSubject)

    // let imputEle = document.getElementById('email-subject') as HTMLElement
    let imputEle = this.elementRef.nativeElement.querySelector('#content-editable');
    imputEle.innerHTML = fommattedActionSubject;
    // imputEle.focus(imputEle);
    this.placeCaretAtEnd(imputEle)
  }

  placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  setAttribute(attribute) {
    console.log("[TEXT-EDITABLE-DIV] selectedAttibute attribute: ", attribute);
    const imputEle = document.querySelector('#email-subject') as HTMLElement
    console.log("[TEXT-EDITABLE-DIV] selectedAttibute imputEle: ", imputEle);
    imputEle.focus();
    this.setAttributeAtCaret(`<div contenteditable="false" style="font-weight: 400;font-family: 'ROBOTO'; background: #ffdc66;cursor: pointer;-webkit-transition: all 0.3s;  transition: all 0.3s; border-radius: 10px;-webkit-box-decoration-break: clone; box-decoration-break: clone; display: inline; padding: 0 5px;">${attribute}</div>`)
    this.isOpenSetAttributesPanel = false;
    this.onInput()
  }


  setAttributeAtCaret(html: any) {
    var sel, range;
    if (window.getSelection) {
      // IE9 and non-IE
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        // Range.createContextualFragment() would be useful here but is
        // only relatively recently standardized and is not supported in
        // some browsers (IE9, for one)
        var el = document.createElement("div");
        el.innerHTML = html;
        var frag = document.createDocumentFragment(), node, lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        // var firstNode = frag.firstChild;
        range.insertNode(frag);

        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          // if (selectPastedContent) {
          //     range.setStartBefore(firstNode);
          // } else {
          //     range.collapse(true);
          // }
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }


  onInput() {
    var contenteditable = document.querySelector('[contenteditable]'),
      text = contenteditable.textContent;

    console.log('contenteditable innerHtml', contenteditable.innerHTML)

    console.log('onInputActionSubject text ', text)
    this.text = text;
    this.textChanged.emit(this.text) 
   
  }

  toggleSetAttributesPanel(isopen) {
    console.log("[TEXT-EDITABLE-DIV] isopen Attributes Panel: ", isopen);
    this.isOpenSetAttributesPanel = isopen
  }



}
