import { TestBed, async, inject } from '@angular/core/testing';

import { AppModule } from '../../app/app.module';

import { Http, BaseRequestOptions, Response, ResponseOptions, RequestOptions } from '@angular/http';

import { MockBackend, MockConnection } from '@angular/http/testing';

import { Observable } from 'rxjs/Observable';

import { Routes } from '@angular/router';

import { RouterTestingModule } from '@angular/router/testing';

let json = require('../../assets/album.json');

let html;
try {
  html = require('../../app/product-tracklisting/product-tracklisting.component.html');
} catch (e) { }

let productTracklistingComponentExists = false;
let ProductTracklistingComponent;
try {
  ProductTracklistingComponent = require('../../app/product-tracklisting/product-tracklisting.component.ts').ProductTracklistingComponent;
  productTracklistingComponentExists = true;
} catch (e) {
  productTracklistingComponentExists = false;
}

let productServiceExists = false;
let ProductService;
try {
  ProductService = require('../../app/product.service.ts').ProductService;
  productServiceExists = true;
} catch (e) {
  productServiceExists = false;
}

let findComments = function(el) {
    var arr = [];
    for(var i = 0; i < el.childNodes.length; i++) {
        var node = el.childNodes[i];
        if(node.nodeType === 8) {
            arr.push(node);
        } else {
            arr.push.apply(arr, findComments(node));
        }
    }
    return arr;
};


describe('ProductTracklisting', () => {

  let product_service;
  let mock_backend;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule.withRoutes([])],
      providers: [ProductService, MockBackend, BaseRequestOptions,
        {
          provide: Http,
          useFactory: (mockBackend: MockBackend, defaultOptions: RequestOptions) => {
            return new Http(mockBackend, defaultOptions);
          },
          useClass: Http,
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  }));

  beforeEach(inject([ProductService, MockBackend], (productService, mockBackend) => {
    product_service = productService;
    mock_backend = mockBackend;
  }));

  it(`should use ngFor to enumerate through each track in a ul tag @product-tracklisting-html-uses-ngfor-to-enumerate-tracks`, async(() => {
    expect(productTracklistingComponentExists).toBe(true);

    mock_backend.connections.subscribe((connection: MockConnection) => {
      let options = new ResponseOptions({
        body: json
      });
      connection.mockRespond(new Response(options));
    });

    const ProductTracklistingFixture = TestBed.createComponent(ProductTracklistingComponent);
    ProductTracklistingFixture.detectChanges();

    let comments = findComments(ProductTracklistingFixture.nativeElement);

    expect(ProductTracklistingFixture.nativeElement.querySelectorAll('div.tracklisting ul').length).toBeGreaterThan(1);
    expect(comments.length).toBeGreaterThan(0);

    let containsBinding = 0;    
    if (comments.length > 0) {
      comments.forEach(element => {
        if (element.nodeValue.match('ng-reflect-ng-for-of')) {
          containsBinding = containsBinding + 1;
        }
      });
    }
    expect(containsBinding).toBe(1);
  }));

});
