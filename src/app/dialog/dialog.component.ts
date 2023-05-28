import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  freshnessList = ['Brand New', 'Second Hand', 'Refurbished'];
  productForm!: FormGroup;
  actionButton: string = 'save';
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public ediData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });
    if (this.ediData) {
      this.actionButton = 'Update';
      this.productForm.controls['productName'].setValue(
        this.ediData.productName
      );
      this.productForm.controls['category'].setValue(this.ediData.category);
      this.productForm.controls['freshness'].setValue(this.ediData.freshness);
      this.productForm.controls['price'].setValue(this.ediData.price);
      this.productForm.controls['comment'].setValue(this.ediData.comment);
      this.productForm.controls['date'].setValue(this.ediData.date);
    }
  }
  addProduct() {
    if (!this.ediData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('Product Added Successfully');
            this.productForm.reset();
            this.dialogRef.close('saved');
          },
          error: () => {
            alert('Error while adding the product');
          },
        });
      }
    } else {
      this.updateProduct();
    }
  }
  updateProduct() {
    this.api.putProduct(this.productForm.value, this.ediData.id).subscribe({
      next: (res) => {
        alert('Product Updated Successfully');
        this.productForm.reset();
        this.dialogRef.close('updated');
      },
      error: () => {
        alert('Error while updating the product');
      },
    });
  }
}
