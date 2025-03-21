import { LightningElement, track, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import createForecastInvoice from '@salesforce/apex/manualAccountingInfinityLWCController.insertForecastInvoice';
import invoiceList from '@salesforce/apex/manualAccountingInfinityLWCController.showlist';
import opportunityList from '@salesforce/apex/manualAccountingInfinityLWCController.oppforecast';
import Opportunity from '@salesforce/schema/Opportunity';
import Infinity_Sales_Area__c from '@salesforce/schema/Opportunity.Infinity_Sales_Area__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';




export default class ManualAccountingInfinityLWC extends NavigationMixin(LightningElement){
    @track selectedinvoicerow = [];
    @track saleofficeArea = [];
    @track datatabledata = [];
    @track opportunityDataTable= [];
    @track errorSaleOffice;
    @track error = false;
    @track submitError;
    @track options = ['Option 1', 'Option 2', 'Option 3'];
    @track value;
    @track transformedData;
    @track yearvalue;
    @track monthvalue;
    @track areavalue;
    @track getSalesArea;
    @track getMonth;
    @track getYear;
    @track getsearchkeyword;
    @track searchKeyword;
    @track Forecast_Invoice_No;
    @track Product_Forecast_Id;
    @track Invoic_Id;
    @track pgeRecordID;
    @track firstcmp = true;
    @track secondcmp = false;
    @track thirdcmp = false;
    @track isLoading = false;


    @wire (getObjectInfo,{objectApiName : Opportunity})
    opportunityInfo;

    @wire(getPicklistValues, { recordTypeId: '0127F000000HhfZQAS', fieldApiName: Infinity_Sales_Area__c })
    salesAreapick({data, error}){
      if(data){

        this.transformedData = data.values.map(function(entry) {
          return {
            label: entry.label,
            value: entry.value
          };
        });
        console.log('this.transformedData',this.transformedData);

      }
      else if(error)
      alert(error)

    }

    months = [{ "label": "JAN", "value": "JAN" },
		{ "label": "FEB", "value": "FEB" },
		{ "label": "MAR", "value": "MAR" },
		{ "label": "APR", "value": "APR" },
		{ "label": "MAY", "value": "MAY" },
		{ "label": "JUN", "value": "JUN" },
		{ "label": "JUL", "value": "JUL" },
		{ "label": "AUG", "value": "AUG" },
		{ "label": "SEP", "value": "SEP" },
		{ "label": "OCT", "value": "OCT" },
		{ "label": "NOV", "value": "NOV" },
		{ "label": "DEC", "value": "DEc" },
		];
    
   
   columns = [
      { label: 'Sales Office', fieldName: 'Sales_office__c'},
      { label: 'Billing Date', fieldName: 'Billing_Date_2__c' },
      { label: 'Invoice Number', fieldName: 'Name'},
      { label: 'Customer Name', fieldName: 'Customer_Name__c' },
      { label: 'Product', fieldName: 'Product_Name__c'},
      { label: 'Length', fieldName: 'Length__c'},
      { label: 'width', fieldName: 'Width__c'},
      { label: 'Appropriable Qty', fieldName: 'Appropriable_Quantity__c'},
      { label: 'Total Available Qty', fieldName: 'Total_available_quantity__c'},
  
  ];

  oppscolumns = [
    { label: 'Opportunity Name', fieldName: 'Opportunity_Name__c'},
    { label: 'Month', fieldName: 'Month__c' },
    { label: 'Product Name', fieldName: 'Product_Name__c'},
    { label: 'Project Code', fieldName: 'Project_Code__c'},
    { label: 'Planned Quantity', fieldName: 'Planned_Quantity__c'},
    { label: 'Available Quantity', fieldName: 'available_quantity__c'},

];
   get yearss(){

    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = 0; i < 10; i++) {
      const year = currentYear - i;
      //years.push({ label: year, value: year });
      years.push({ label: year.toString(), value: year.toString() });

    }
       return years
        
      }

      

    handleSalesAreaChange(event){
        this.getSalesArea = event.target.value;
        //alert(event.target.value);
        //alert('Sales Area' + this.getSalesArea)
    }

    handlemonth(event){
      this.getMonth = event.target.value;
      //alert(event.target.value)
      //alert('Month' + this.getMonth)
    }
    handleyear(event){
      this.getYear = event.target.value;
      //alert(event.target.value)
      //alert('Year'+ this.getYear)
    }

    handlesearchinput(event){
      this.getsearchkeyword = event.target.value
      //alert(event.target.value)
      //alert('Input ' + this.getsearchkeyword)
    }

    /*handledatatable(event){

      if(this.selectedinvoicerow.length == 1){
     // alert('hi');
      alert(JSON.stringify(event.target.draftValues))
      const selectedRows = event.target.draftValues;
       const accounting_qty = selectedRows[0]["Accounting_Qty__c"]
       const accounting_qty1 = this.selectedinvoicerow[0]["Total_available_quantity__c"]
       //alert(JSON.stringify(this.selectedinvoicerow))
       //alert('accounting_qty', accounting_qty)
       //alert('accounting_qty1', accounting_qty1)

       if(accounting_qty == accounting_qty1){
        this.getSelectedNameApex();

       }
       else{
           alert('Available Qunty and Accounting Qunty should be Same')
       }
      //alert('Selected Length>>>'+ selectedRows.length)
     // alert('Edited value>>>'+ JSON.stringify(accounting_qty))
      
      
      
      }

      else{
        alert('First select the Row OR Select the only one row')
      }

    }*/

    getSelectedName(event) {

      if(event.detail.selectedRows.length>0){

      //alert(' opportunity Gokul')
      //alert(JSON.stringify(event.detail.selectedRows))
      //const selectedRowsinspire = event.detail.selectedRows;
     this.selectedinvoicerow = event.detail.selectedRows;
     const accounting_qty1 = this.selectedinvoicerow[0]["Total_available_quantity__c"]
     this.Invoic_Id = this.selectedinvoicerow[0]["Id"];
     //alert('Total_available_quantity__c======='+ accounting_qty1)
     
     
      
      var selectedRows=event.detail.selectedRows;
        if(selectedRows.length>1 || selectedRows.length<1) 
        {
            var el = this.template.querySelector('lightning-datatable');
            selectedRows=el.selectedRows=el.selectedRows.slice(1);
            this.showNotification();
            event.preventDefault();
            return;
        }
        this.getSelectedNameApex();

      }
    }

    getSelectedNameApex(){
      this.secondcmp = false;
      this.isLoading = true;
      opportunityList({ salesArea:  this.getSalesArea, Year: this.getYear, Month: this.getMonth})
      .then(result => {

        if(result.length == 0){
          this.isLoading = false;
          this.error = true;
          this.submitError = 'opportunity Not Found'
  
        }
        else{
        //alert('opportunity Data table retrun value', JSON.stringify(result));
        console.log(' opportunity Data table retrun value', JSON.stringify(result));
        this.opportunityDataTable = result;
        //alert('length of the return value>>>'+ this.opportunityDataTable.length)
        this.error = undefined;
        this.isLoading = false;
        }
      })
      .catch(error => {
        this.error = error;
        this.opportunityDataTable = undefined;
      })
      this.thirdcmp = true;
      // Display that fieldName of the selected rows
     /* for (let i = 0; i < selectedRows.length; i++) {
          alert('You selected: ' + selectedRows[i].OpportunityName);
      }*/
  }

  getSelectedopportunity(event){
    

    if(event.detail.selectedRows.length > 0){
    
    //alert(JSON.stringify(event.detail.selectedRows))
    console.log('getSelectedopportunity>>>>>>>>>>>>>>'+ JSON.stringify(event.detail.selectedRows))
    const selectedopps = event.detail.selectedRows;
    //alert('Selected Opportunity>>>>'+ JSON.stringify(selectedopps))
     this.Product_Forecast_Id = selectedopps[0]["Id"]
     console.log('this.Product_Forecast_Id>>>>>>>>>>'+ this.Product_Forecast_Id)
    
    
    var selectedRows=event.detail.selectedRows;
        if(selectedRows.length>1)
        {
            var el = this.template.querySelector('lightning-datatable');
            selectedRows=el.selectedRows=el.selectedRows.slice(1);
            this.showNotification();
            event.preventDefault();
            return;
        }

        //alert('createForecastInvoice')
        this.thirdcmp = false;
        this.isLoading = true;
        createForecastInvoice({InvoiceNumber: this.getsearchkeyword, ForecastInvoiceNumber: this.Product_Forecast_Id, InvoiceId: this.Invoic_Id })
      .then(result => {
        
        this.pgeRecordID = result; 


       // alert('call the page navigation');
        //this.error = undefined;
        this.isLoading = false;
        
        //this.navigateToListView();
        this.refreshData();

      })
      .catch(error => {
        this.error = error;
        this.opportunityDataTable = undefined;
      })

    } 
  }

  refreshData() {
    this.firstcmp = true;
    this.secondcmp = false;
    this.thirdcmp = false;
    this.isLoading = false;
    // Fetch the latest data from the server and update the component
}

  




navigateToListView() {
  // Navigate to the Contact object's Recent list view.
  this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
          objectApiName: 'Forecast_Invoice__c',
          actionName: 'list'
      },
      state: {
          // 'filterName' is a property on the page 'state'
          // and identifies the target list view.
          // It may also be an 18 character list view id.
          filterName: 'Recent' // or by 18 char '00BT0000002TONQMA4'
      }
  });
}


  showNotification() {
    this.isLoading = false;
    const event = new ShowToastEvent({
        title: 'Error',
        message: 'Only one row can be selected',
        variant: 'warning',
        mode: 'pester'
    });
    this.dispatchEvent(event);
}

  /*cellchangehandler(event){
    
    const selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
    alert('edited entire row%%%%%%%%%%%%', JSON.stringify(selectedRecords))
    this.handledatatable(event)
    
  }*/

    handleClick(event) {

      /*alert('month'+ this.getMonth)
      alert('Year'+ this.getYear)
      alert('SalesArea'+ this.getSalesArea)
      alert('getsearchkeyword'+ this.getsearchkeyword)*/

      
      
      if (this.getMonth === "" || this.getYear === "" || this.getSalesArea === "" || this.getsearchkeyword=== "") {
        // strValue was empty string
        //alert('SalesArea,  Year, Month, InvoiceNumber Should not blank')
        this.error = true;
        this.submitError = 'SalesArea,  Year, Month, Invoice Number Should not be blank'
    }

     else if (this.getMonth === undefined || this.getYear === undefined || this.getSalesArea === undefined || this.getsearchkeyword === undefined) {
      // strValue was empty string
      //alert('SalesArea,  Year, Month, Invoice Number Should not blank')
      this.error = true;
      this.submitError = 'SalesArea,  Year, Month, InvoiceNumber Should not be blank'
      
  }

  else{
     this.error = false;
     this.firstcmp = false;
     this.secondcmp= true;
     
     const searchKey = this.getsearchkeyword;
     this.isLoading = true;
     invoiceList({ searchtext: searchKey })
		.then(result => {
      //alert(result.length)
      if(result.length == 0){
        this.isLoading = false;
        this.error = true;
        this.submitError = 'Invoice Not Found'

      }
      
     else{ 
      //alert('else block')
      console.log('Data table retrun value', JSON.stringify(result));
			this.datatabledata = result;
			this.error = undefined;
      this.isLoading = false;
    }
		})
		.catch(error => {
			this.error = error;
			this.datatabledata = undefined;
		})

  }
  }
}
