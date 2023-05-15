import React, { useEffect, useLayoutEffect, useState } from 'react';
import { excludeDatesCheckin } from './ExcludeDates/excludesdates';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Variables from './Variables';
import brewDate from 'brew-date';
import formatDate from './PreBook/Date_Format/DateFormatter';
import retrieveDate from './PreBook_Date_Spike/DateCorrector';
import Loading from './Loading';
import Table from './Table';
import InlineToast from './InlineToast/Inline.toast.view';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ModalCheckOut from './ModalCheckOut';
import Wizard from './Wizard/model.wizard.view';
import { getStorage } from '../Controller/Storage/Storage';
import Modals from './Modals';
import { handleTimeFormat, loadDate, getStayedDays, getExtraBedPrice } from './common.functions/common.functions';


const HomeRoom = (props) => {
    
    const current = new Date();
    const date = `${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()}`;
    const getTime = current.getHours() + ":" + current.getMinutes();

    // Admin configurations!
    var isExclusive = JSON.parse(getStorage("isExclusive"));
    var isHourly = JSON.parse(getStorage("isHourly"));
    var extraCalc = JSON.parse(getStorage("extraCalc"));

    // Exclude dates for prebook modals
    const [excludeDates, setExcludeDates] = useState([])
    const getExcludeDates = async (roomid) => {
        await axios.get(`${Variables.hostId}/${roomid}/excludedates`)
            .then(res => {
                if (res.data.success) {
                    res.data.message.map((item) => {
                        item.forEach(element => {
                            setExcludeDates(oldValue => [...oldValue, new Date(element)]);
                        })
                    })
                } else {
                    // TODO: Error handling!
                }
            })
    }

    // Exclude dates for checkin users!
    const getExcludeDatesCheckin = async (roomid) => {
        try{
            const response = await excludeDatesCheckin(roomid);
            if (response.success) {
                response.message.map((item) => {
                    item.forEach(element => {
                        setExcludeDates(oldValue => [...oldValue, new Date(element)]);
                    })
                })
            } else {
                // TODO: error handling!
            }
        } catch(err){
            console.warn("getBetween function needs start date and end date...");
        }
    }

    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showerror, setShowerror] = useState(false);
    const [userdata, setUserdata] = useState([]);
    const [showGeneratedBill, setShowGeneratedBill] = useState(false);
    const [amount, setAmount] = useState();

    // Is Channel State Handler!
    const [isChannel, setIsChannel] = useState(false);
    const [updatePrice, setUpdatePrice] = useState();

    // Disable GST State Handler!
    const [isGst, setIsGst] = useState(true);
    
    // Limit for advance amount state handler!
    const [limits, setLimits] = useState();
    
    // State handler for total amount incase of negative value!
    const [tNAmount, setTNAmount] = useState(0);

    // Total dish rate calculation
    const [calcdishrate, setCalcdishrate] = useState();

    // isChannel enabled for the particular user!
    const [channel, setChannel] = useState({
        isChannel: false,
        channelName: undefined
    });

    //Loader--Modal
    const [loading, setLoading] = useState(false);

    // Wizard state handler!
    const [isWizard, setIsWizard] = useState(false);

    // Extra bed state handler!
    const [isExtra, setIsExtra] = useState(JSON.parse(getStorage("isExtra")));
    const [extraCount, setExtraCount] = useState();

    // Customer Data
    const [customername, setCustomername] = useState();
    const [customerphonenumber, setCustomerphonenumber] = useState();
    const [secondphonenumber, setSecondphonenumber] = useState();
    const [adults, setAdults] = useState(0);
    const [childrens, setChildrens] = useState(0);
    const [day, setDay] = useState(null);
    const [stayeddays, setStayeddays] = useState();
    const [checkoutdate, setCheckoutdate] = useState();
    const [aadhar, setAadhar] = useState();
    const [showmodal, setShowmodal] = useState();
    const [userid, setUserid] = useState();
    const [dishrate, setDishrate] = useState([]);
    const [totaldishrate, setTotaldishrate] = useState([]);
    // Chek out date for normal bookers
    const [checkedoutdate, setCheckedoutdate] = useState();
    // Discount Amount for the customer!
    const [discount, setDiscount] = useState();
    // Advance amount for the customer!
    const [advanceCheckin, setAdvanceCheckin] = useState();
    const [dropdown, setDropdown] = useState("Walk-In");

    // Inline Error Handler!
    const [inline, setInline] = useState({
        inlineErrorDiscount: false,
        inlineErrorAdvance: false,
        inlineAdults: false,
        inlineAdultsText: undefined,
        inlineChildrens: false,
        inlineChildrensText: undefined,
        inlineErrorUpdate: false,
        inlineText: undefined,
        inlineAdvanceText: undefined,
        inlineDiscountText: undefined
    })

    // Model value for the state handler
    var _inlineModel = {
        inlineErrorDiscount: inline.inlineErrorDiscount,
        inlineErrorAdvance: inline.inlineErrorAdvance,
        inlineAdults: inline.inlineAdults,
        inlineAdultsText: inline.inlineAdultsText,
        inlineChildrens: inline.inlineChildrens,
        inlineChildrensText: inline.inlineChildrensText,
        inlineErrorUpdate: inline.inlineErrorUpdate,
        inlineText: inline.inlineText,
        inlineAdvanceText: inline.inlineAdvanceText,
        inlineDiscountText: inline.inlineDiscountText
    }


    // Pre Book Customer Data
    const [prebookusername, setPrebookusername] = useState();
    const [prebookphonenumber, setPrebookphonenumber] = useState();
    const [prebooksecondnumber, setPrebooksecondnumber] = useState();
    const [prebookadults, setPrebookadults] = useState();
    const [prebookchildren, setPrebookchildren] = useState();
    const [prebookaadhar, setPrebookaadhar] = useState();
    const [prebookadvance, setPrebookadvance] = useState();
    const [prebookdiscount, setPrebookdiscount] = useState();
    const [prebookdateofcheckin, setPrebookdateofcheckin] = useState();
    const [prebookdateofcheckout, setPrebookdateofcheckout] = useState();


    // Modal Handler!
    const handleClose = () => {
        setShow(!show);
        getExcludeDates(props.roomid);
        getExcludeDatesCheckin(props.roomid);
    }

    const handleModal = () => {
        setShowmodal(!showmodal)
    }


    const handleCloseModal = () => {
        setShowerror(!showerror);
    }

    const handleCloseGeneratedBill = () => {
        setShowGeneratedBill(!showGeneratedBill);
    }

    // Pre Book Modal Method
    const [prebookmodal, setPrebookmodal] = useState(false);
    const preBookModal = () => {
        setPrebookmodal(!prebookmodal);
        getExcludeDates(props.roomid);
        getExcludeDatesCheckin(props.roomid);
    }

    // Add data to the prebook modal
    const processDataPreBook = () => {
        const changedDate = formatDate(prebookdateofcheckin);
        const checkinTime = props.excludeTime.checkinTime // For prebook - time of checkin!
        const checkoutTime = props.excludeTime.checkoutTime // For prebook - time of checkout!
        setLoading(true);
        const credentials = {
            prebookusername: prebookusername,
            prebookphonenumber: prebookphonenumber,
            prebooksecondnumber: prebooksecondnumber,
            prebookadults: prebookadults,
            prebookchildren: prebookchildren,
            prebookaadhar: prebookaadhar,
            prebookdateofcheckin: formatDate(props.excludeTime.checkinDate),
            prebookdateofcheckout: formatDate(props.excludeTime.checkoutDate),
            prebookadvance: prebookadvance,
            prebookdiscount: prebookdiscount,
            prebookprice: props.price,
            suitetype: props.roomtype,
            roomid: props.roomid,
            checkinTime: checkinTime,
            checkoutTime: checkoutTime
        }

        axios.post(`${Variables.hostId}/${props.lodgeid}/addprebookuserrooms`, credentials)
            .then(res => {
                if (res.data.success) {
                    setLoading(false);
                    preBookModal();
                    setShowerror(true);
                    setSuccess(res.data.message);
                    props.load(!props.reload);
                } else {
                    setLoading(false);
                    setShowerror(true);
                    setSuccess(res.data.message);
                }
            })
    }

    // Reload the page 
    const refresh = () => {
        props.setLoad(true);
    }

    // Handle Checkout Time
    function handleCheckoutTime(time){
        if(checkedoutdate === undefined){
            return undefined;
        } else {
            return time;
        }
    }


    // Add Data to the model
    const processData = () => {

        setLoading(true);
        // Keeping the checkout date optional as per the design!
        const isnum = /^\d+$/;
        if (!isnum.test(customerphonenumber)) {
            setLoading(false);
            setShowerror(true);
            setSuccess("Phone Number is not valid...")
        } else if (!isnum.test(adults)) {
            setLoading(false);
            setShowerror(true);
            setSuccess("Adults count should be in Numbers format...")
        } else if (!isnum.test(childrens)) {
            setLoading(false);
            setShowerror(true);
            setSuccess("Childrens count should be in Numbers format...")
        } 
        // else if (!isnum.test(aadhar)) {
        //     setLoading(false);
        //     setShowerror(true);
        //     setSuccess("ID Number should be in Number format...") 
        // } // Removed this check as we take id number which can be anything instead of aadhar number!
        else {
            const credentials = {
                customername: customername,
                phonenumber: customerphonenumber,
                secondphonenumber: secondphonenumber,
                adults: adults,
                childrens: childrens,
                aadhar: aadhar,
                checkin: brewDate.getFullDate("yyyy/mm/dd"),
                checkinTime: getTime,
                checkout: formatDate(checkedoutdate),
                checkoutTime: handleCheckoutTime(getTime),
                roomid: props.roomid,
                roomno: props.roomno,
                discount: discount,
                advance: advanceCheckin,
                channel: dropdown,
                isChannel: isChannel,
                updatePrice: updatePrice,
                extraBeds: extraCount,
                extraBedPrice: props.extraBedPrice
            }
            axios.post(`${Variables.hostId}/${props.lodgeid}/adduserrooms`, credentials)
                .then(res => {
                    if (res.data.success) {
                        setLoading(false);
                        handleClose();
                        setShowerror(true);
                        setSuccess(res.data.message);
                        refresh();
                    } else {
                        setLoading(false);
                        setShowerror(true);
                        setSuccess(res.data.message)
                    }
                })
        }
    }

    // Retrieve User Room data from the API
    const getUserData = async () => {
        const credentials = {
            roomid: props.roomid
        }
        await axios.post(`${Variables.hostId}/${props.id}/userroom`, credentials)
            .then(res => {
                if (res.data.success) {
                    setUserdata(res.data.message);
                    handleModal();
                } else {
                    setShowerror(true);
                    setSuccess(res.data.message)
                }
            })
    }


    // Error-Text for prebooked user!
    const [advance, setAdvance] = useState();
    const [amount_advance, setAmount_advance] = useState(0);
    const [discountApplied, setDiscountApplied] = useState();
    const [discountPrice, setDiscountPrice] = useState(0);
    const [totalAmount, setTotalAmount] = useState();
    const [extraCollection, setExtraCollection] = useState(0);
    // Check Out Customer Data
    const clearData = async () => {   
        const credentials = {
            userid: userid,
            roomid: props.roomid,
            stayeddays: stayeddays,
            checkoutdate: checkoutdate,
            roomtype: props.roomtype
        }

        const generation = {
            roomtype: props.roomtype,
            stayeddays: stayeddays,
            roomid: props.roomid,
            lodgeid: props.lodgeid,
            isHourly: isHourly,
            extraCalc: extraCalc
        }

        const generateDishRate = {
            roomid: props.roomid
        }

        await axios.post(`${Variables.hostId}/${props.lodgeid}/dishuserrate`, generateDishRate)
            .then(res => {
                if (res.data.success) {
                    setDishrate(res.data.message)
                } else {
                    setShowerror(true);
                    setSuccess(res.data.message);
                }
            })

        await axios.post(`${Variables.hostId}/${props.lodgeid}/generatebill`, generation)
            .then(res => {
                if (res.data.success) {
                    setExtraCollection(res.data.extraBedCollection); // Include extra bed calculation based on number of days stays!
                    setTNAmount(res.data.message); // Incase of negative value!
                    handleCloseGeneratedBill();
                    setAmount(res.data.message);
                    
                    if (res.data.prebook) {
                        setTotalAmount(res.data.message - res.data.advance - res.data.advanceDiscountPrice);
                        setAmount_advance(res.data.advance);
                        setDiscountPrice(res.data.advanceDiscountPrice);
                        // {isNaN(res.data.advance) ? setAdvance(true) : setAdvance(false)};
                        // {isNaN(res.data.advanceDiscountPrice) ? setDiscountApplied(true) : setDiscountApplied(false)}
                        { (res.data.advance === undefined || res.data.advance === null) ? setAdvance(false) : setAdvance(true) }
                        { (res.data.advanceDiscountPrice === undefined || res.data.advanceDiscountPrice === null) ? setDiscountApplied(false) : setDiscountApplied(true) }
                    } else {
                        if (res.data.isAdvanced || res.data.discount) {
                            setAdvance(res.data.isAdvanced);
                            setDiscountApplied(res.data.discount);
                            setDiscountPrice(res.data.discountPrice);
                            setAmount_advance(res.data.advanceCheckin);

                            // If not channel manager, default behaviour
                            if(res.data.isChannel){
                                setTotalAmount(res.data.totalAmount);
                            } else {
                                setTotalAmount(res.data.message - res.data.advanceCheckin - res.data.discountPrice) 
                            }
                        } else {

                            // If not channel manager, default behaviour
                            if(res.data.isChannel){
                                setTotalAmount(res.data.totalAmount);
                            } else {
                                setTotalAmount(res.data.message - res.data.advanceCheckin - res.data.discountPrice) 
                            }
                        }
                    }
                } else {
                    setShowerror(true);
                    setSuccess(res.data.message)
                }
            })

        await axios.post(`${Variables.hostId}/${props.lodgeid}/calcdishuserrate`, generateDishRate)
            .then(res => {
                if (res.data.success) {
                    setCalcdishrate(res.data.message);
                } else {
                    setShowerror(true);
                    setSuccess(res.data.message);
                }
                // setTotaldishrate(Number(totalDishrate) + Number(amount));
            })

    }

    // Handle GST Handler!
    function gstHandler() {
        setIsGst(!isGst);
    }

    // Handle Channel Manager!
    function handleChannel(value) {

        // Check if the rate has to be updated or not!
        if (value !== "Walk-In") {
            setIsChannel(true);
        } else {
            setIsChannel(false);
        }
        setDropdown(value);
    }

    // Check limit for advance and discount!
    function checkLimit(limits, isCheckoutdate, constant) {
        var limit;
        
        if(constant === "Discount"){
            limit = props.price * limits;
        } else {
          limit = isCheckoutdate !== undefined ? limits : props.price * limits;
        }
        
        return limit;
    }

    // Function restrict discount!
    function restrictDiscount(val) {

        const limitValue = 3 / 4;
        
        const constant = "Discount";

        const Limit = checkedoutdate !== undefined ? (limits - advanceCheckin) * limitValue : checkLimit(limitValue);

        var inlineText = `Discount amount cannot be greater than Rs.${Limit}`

        if (val > Limit) {
            _inlineModel['inlineErrorDiscount'] = true;
            _inlineModel['inlineDiscountText'] = inlineText
            handleInlineToast(_inlineModel)
            setDiscount(val);
        } else {
            _inlineModel['inlineErrorDiscount'] = false;
            _inlineModel['inlineDiscountText'] = undefined
            handleInlineToast(_inlineModel)
            setDiscount(val); // and then set the value!
        }

    }

    // Open Inline Toast!
    function handleInlineToast(_inlineModel) {
        // populate the model
        populateInlineModel(_inlineModel);
    }
    
    // Update Extra Count Beds!
    async function updateExtraCount(value){
      setExtraCount(value);
      const extraBedPrice = await getExtraBedPrice(props.roomtype, props.lodgeid);
      setLimits(limits => {
        const updateValue = Number(limits) + Number(extraBedPrice);
        return updateValue
      })
    }
    
    // Check for the advance amount!
    function checkAdvance(checkoutDate){
      const currentDate = brewDate.getFullDate("yyyy/mm/dd");
      const dateofCheckout = checkoutDate;
      const stayDays = getStayedDays(currentDate, dateofCheckout);
      const tAmount = stayDays * +props.price;
      setTotalAmount(tAmount);
      // Get the total amount with GST!
      const totalWithGST = getTotalAmountWithGST(tAmount);
      if(isNaN(totalWithGST)){
        checkAdvance(checkoutDate);
      } else {
        setLimits(totalWithGST);
      }
    }
    
    // Restrict Adults Count!
    function restrictAdults(value, action){
      var inlineText = "Adults count cannot be greater than 5."
      if(value > 5){
        _inlineModel['inlineAdults'] = true;
        _inlineModel['inlineAdultsText'] = inlineText
      } else {
        _inlineModel['inlineAdults'] = false;
        updateAdults(value, action)
      }
      handleInlineToast(_inlineModel)
    }
    
    // Update adults model data!
    function updateAdults(value, action){
      if(action === "CHECK-IN"){
        setAdults(value)
      } else {
        setPrebookadults(value)
      }
    }
    
    // Restrict Childrens Count!
    function restrictChildrens(value, action){
      var inlineText = "Childrens count cannot be greater than 5."
      if(value > 5){
        _inlineModel['inlineChildrens'] = true;
        _inlineModel['inlineChildrensText'] = inlineText
      } else {
        _inlineModel['inlineChildrens'] = false;
        updateChildrens(value, action);
      }
      
      handleInlineToast(_inlineModel)

    }
    
    // Update Childrens model!
    function updateChildrens(value, action){
      if(action === "CHECK-IN"){
        setChildrens(value);
      } else {
          setPrebookchildren(value)
      }
    }

    // Restrict advance amount
    function restrictAdvance(val) {
      
        const limitValue =  3 / 4;
        
        const constant = "Advance";
        
        const limit = checkedoutdate !== undefined ? checkLimit(limits, checkedoutdate, constant) : checkLimit(limitValue, checkedoutdate, constant);

        var inlineText = `Advance amount cannot be greater than Rs.${limit} without discount amount!`;
        
        _inlineModel['inlineErrorAdvance'] = true;
        _inlineModel['inlineAdvanceText'] = inlineText
        handleInlineToast(_inlineModel)
        
        if (val > limit) {
          return
       } else {
           setAdvanceCheckin(val); // and then set the value!
       }

    }

    function populateInlineModel(_model) {
        setInline({
            ...inline,
            inlineErrorDiscount: _model.inlineErrorDiscount,
            inlineErrorAdvance: _model.inlineErrorAdvance,
            inlineAdults: _model.inlineAdults,
            inlineAdultsText: _model.inlineAdultsText,
            inlineChildrens: _model.inlineChildrens,
            inlineChildrensText: _model.inlineChildrensText,
            inlineErrorUpdate: _model.inlineErrorUpdate,
            inlineText: _model.inlineText,
            inlineAdvanceText: _model.inlineAdvanceText,
            inlineDiscountText: _model.inlineDiscountText
        })
    }

    // Update wizard configuration helper function!
    function inputChangeWizard(data) {
        setUpdatePrice(data);
    }
    
    // Get checkin date for the specific customer!
    function getCheckinDate(){
      var checkinDate
      userdata.map((options, key) => {
        checkinDate = options.dateofcheckin;
      })
      return checkinDate;
    }
    
    // Get total amount based on currently stayed days!
    function getAmountOfStay(){
      const checkindate = getCheckinDate();
      const stayedDays = getStayedDays(checkindate, checkoutdate); // Checkout date was populated from modal checkout component!
      return props.price * (stayedDays + 1); // Incrementing here by 1 because 26 hours also comes as 1 day stay!
    }

    function updateBillPrice() {
      
        const limit = getAmountOfStay(); // Limit the update bill price upto the extend of room price * currently stayed days!
      
        if(updatePrice > limit){
            _inlineModel['inlineErrorUpdate'] = true;
            _inlineModel['inlineText'] = `Cannot update rate more than ${limit}!`
        } else if(updatePrice === undefined) {
            _inlineModel['inlineErrorUpdate'] = true;
            _inlineModel['inlineText'] = "Please provide a valid price!"
        } else {
            setTotalAmount(Number(updatePrice));
            _inlineModel['inlineErrorUpdate'] = false;
            openUpdateWizard(); // close the wizard after updating!
        }

        handleInlineToast(_inlineModel);

    }

    function openUpdateWizard() {
        setIsWizard(!isWizard);
    }

    // Populate invoice modal!
    function populateInvoice(value){
        var gstCalculation = determineGst();

        // Populate the model with userdata!
        userdata.map((options, key) => {
            props.node({
                invoice: value.invoice, // Prompting the window to open for bill generation
                tInvoice: value.tInvoice, // Will not open the TAX invoice generator if false!
                address: inputFieldInvoice.address,
                gstin: inputFieldInvoice.gstin,
                customerName: options.username,
                phoneNumber: options.phonenumber,
                igst: value.igst,
                cgst: value.cgst,
                extraBeds: options.extraBeds,
                dateofCheckIn: options.dateofcheckin,
                gstPercent: determinGstPercent(),
                isGst: isGst,
                gst: gstCalculation,
                stayedDays: stayeddays,
                roomRent: getTotalAmount(),
                extraBeds: options.extraBeds,
                extraBedAmount: extraCollection,
                dateofCheckout: checkoutdate,
                checkinTime: options.checkinTime,
                checkoutTime: getTime,
                discount: options.discount,
                advance: options.advance,
                receiptId: options.receiptId,
                amount: function () {
                    if(channel.isChannel){
                        return getTotalAmount() + gstCalculation;
                    } else {
                        return isGst ? getTotalAmountWithGST() : getTotalWithoutGST();
                    }
                },
                roomno: options.roomno,
                lodgeName: props.lodgeName
            })
        })
    }

    // Invoice Generator!
    async function windowPrint() {
        const value = {
            invoice: true,
            tInvoice: false
        }

        await getUserData(); // Call this method to retrieve user data

        populateInvoice(value) // Populate the invoice state with userdata...
    }

    async function generateInvoice(choices){
        if(inputFieldInvoice.address === undefined || inputFieldInvoice.gstin === undefined ){
            setInputFieldInvoice({
                ...inputFieldInvoice,
                error: true,
                errorText: "Please provide a valid data!"
            })
        } else {
            const value = {
                invoice: false,
                tInvoice: true,
                igst: choices.igst,
                cgst: choices.cgst
            }
    
            await getUserData(); // Call this method to retrieve user data
    
            populateInvoice(value); // Populate the invoice state with userdata...
        }
    }

    const [inputFieldInvoice, setInputFieldInvoice] = useState({
        address: undefined,
        gstin: undefined,
        show: false,
        footer: false,
        choiceAttr: true,
        className: "modal-invoice",
        header: false,
        headerText: "Invoice Customer Details",
        error: false,
        errorText: undefined,
        errorView: renderInlineToast(),
        footerAttr: {
            btn: {
                btn1: "OK",
                btn2: "SKIP"
            }
        }, 
        choiceBtn: {
            btn1: "IGST",
            btn2: "CGST"
        },
        btnField: {
            btn1: function(){
               closeInputFieldInvoice();
            }
        },
        message: inputField()
    });


    function closeInputFieldInvoice(){
        const model = {
            show: false
        }

        populateInputFieldInvoice(model);
    }

    function renderInlineToast(){
        return(
            <div>
                <InlineToast message = "Please provide a valid data!" />
            </div>
        )
    }


    function inputField(){
        return(
            <div>
                <input placeholder="Enter your customer address details" className="form-control" onChange={(e) => setInputFieldInvoice(prevState => ({...prevState, address: e.target.value}))} />
                <br />
                <input placeholder="Enter your customer GST IN" className="form-control" onChange={(e) => setInputFieldInvoice(prevState => ({...prevState, gstin: e.target.value}))} />
            </div>
        )
    }

    // TAX invoice generator!
    function windowInvoice(){

        const model = {
            show: true,
            footer: true,
            header: true
        }
        populateInputFieldInvoice(model);
    }

    function populateInputFieldInvoice(model){
        setInputFieldInvoice({
            ...inputFieldInvoice,
            show: model.show,
            footer: model.footer,
            header: model.header,
            data: model.data,
            error: model.error,
            errorText: model.errorText,
        })
    }

    // Edit state options from the child component!
    const [editDetails, setEditDetails] = useState({});

    // Update Customer Details!
    function updateOptions(){
        const options = {
            username: editDetails.username,
            phonenumber: editDetails.phonenumber,
            secondphonenumber: editDetails.secondphonenumber,
            aadharcard: editDetails.aadharcard,
            dateofcheckout: formatDate(editDetails.dateofcheckout),
            adults: editDetails.adults,
            childrens: editDetails.childrens,
            userId: editDetails.userId,
            checkOutTime: editDetails.timeofcheckin,
            roomId: props.roomid
        }

        axios.post(`${Variables.hostId}/${props.lodgeid}/updateoccupieddata`, options)
            .then(res => {
                if (res.data.success) {
                    handleModal();
                    setShowerror(true);
                    setSuccess(res.data.message)
                } else {
                    setShowerror(true);
                    setSuccess(res.data.message)
                }
            })
    }

    // Handle Checkout Customer!
    const checkedOut = async () => {
        handleCloseGeneratedBill();

        const credentials = {
            userid: userid,
            roomid: props.roomid,
            stayeddays: stayeddays,
            checkoutdate: checkoutdate,
            checkoutTime: getTime,
            roomtype: props.roomtype,
            prebook: props.prebook,
            amount: getTotalAmount(),
            refund: getReturnAmount(),
            totalDishAmount: calcdishrate,
            isGst: isGst,
            foodGst: calcdishrate * 0.05,
            stayGst: determineGst(),
        }

        axios.post(`${Variables.hostId}/${props.lodgeid}/deleteuser`, credentials)
            .then(res => {
                if (res.data.success) {
                    handleModal();
                    setShowerror(true);
                    setSuccess(res.data.message)
                    refresh();
                } else {
                    setShowerror(true);
                    setSuccess(res.data.message)
                }
            })
    }
    

    // GST calculation handler!
    function calculateInclusive(t_Amount){
        return Math.round(getTotalAmount(t_Amount) * getGSTPercent(props.price));
    }

    // Exclusice GST calculation!
    function calculateExclusive(t_Amount){
        let tAmount = totalAmount !== undefined ? getAmount() : Number(t_Amount);
        let gstPercent = determinGstPercent();
        let withGST = gstPercent * tAmount;
        return Math.round(withGST);
    }

    // Determine exclusive or inclusive!
    function determineGst(t_Amount){
        if(!channel.isChannel){
            return isExclusive ? calculateExclusive(t_Amount) : calculateInclusive(t_Amount);
        } else {
           return Math.round(getTotalAmount() * getGSTPercent(getTotalAmount()));
        }
    }
    
    // Get Amount with extra collection, considering negative values also!
    function getAmount(){
      return totalAmount < 0 ? Number(tNAmount) + Number(extraCollection) : Number(totalAmount) + Number(extraCollection) + Number(amount_advance)
    }

    // Get total amount with all the neccessary entities!
    function getTotalAmount(t_Amount){
      if(channel.isChannel || !isExclusive){
          let totalPaidAmount = totalAmount !== undefined ? getTotalAmountForGst() : t_Amount
          if(Number(totalAmount) < 0){
            totalPaidAmount = Number(tNAmount) + Number(extraCollection);
          }
          let percent = getGSTPercent(props.price);
          let value = totalPaidAmount / (1 + percent);
          let withoutGST = Number(totalAmount) < 0 ? Number(tNAmount) + Number(extraCollection) : Number(totalAmount) + Number(extraCollection);
          return isGst ? Math.round(value) : withoutGST;
      } else {
          return getExclusiveAmount(t_Amount);
      }
    }
    
    // Get total amount for GST calculation!
    function getTotalAmountForGst(){
      return Number(totalAmount) + Number(amount_advance) + Number(extraCollection);
    }

    // Get amount has to be returned to the customer incase of negative value!
    function getReturnAmount(){
      return Math.abs(amount_advance) - getTotalAmountWithGST();
    }

    
    // Get exclusive total amount!
    function getExclusiveAmount(t_Amount){
      if(totalAmount !== undefined){
        return totalAmount < 0 ? Number(tNAmount) + Number(extraCollection) : Number(totalAmount) + Number(extraCollection);
      } else {
        // Check for negative value!
        return Number(t_Amount)
      }
    }
    
    // Get total amount with GST for preview
    function getTotalAmountWithGST(t_Amount){
      return (getTotalAmount(t_Amount) + determineGst(t_Amount))
    }
    
    // Get total amount without gst!
    function getTotalWithoutGST(){
      return getTotalAmount();
    }

    // Determine GST Percent!
    function determinGstPercent(){
        let exclusive = isExclusive;
        if(exclusive){
            let tAmount = Number(props.price);
            let gstPercent = tAmount < 7500 ? 0.12 : 0.18;
            return gstPercent;
        } else {
            let gstPercent = Number(props.price) < 7500 ? 0.12 : 0.18;
            return gstPercent;
        }
    }

    // Get GST percent!
    function getGSTPercent(rate){
        return rate < 7500 ? 0.12 : 0.18
    }

    // If channel manager enabled, Update the given price as the total amount (Updating on server side) or just update the room price!
    function updatePriceWizard(value){
        setUpdatePrice(value);
    }


    return (
        <div class="col-4" style={{ paddingBottom: "10vh" }}>
            <div class="card text-center">
                <div class="card-header" style={{ color: "black" }}>
                    <strong>Room No : {props.roomno}</strong>
                </div>
                <div class="card-body">
                    <p style={{ color: "black" }}> Engaged : {props.engaged}</p>
                    <p style={{ color: "black" }}> Bed Count : {(props.extraBeds !== "0" && props.extraBeds !== "" ? props.bedcount + "+" + props.extraBeds : props.bedcount)}</p>
                    <p style={{ color: "black" }}> Room Type : {props.roomtype}</p>
                    <p style={{ color: "black" }}> Price Per Day : {props.price}</p>
                </div>

                {/* // Check In Modal */}
                {!props.isPrebook && (
                  <Modal
                      show={show}
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      background="static"
                      className="text-center"
                  >
                      <Modal.Header>
                          <Modal.Title id="contained-modal-title-vcenter">
                              Check In - Feautured
                          </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <div className = "checkin-modal">
                            <h4 className='strong'>{props.roomno}</h4>
                            {
                                props.channel ? (
                                    <div className="modal-gap">
                                        <label style={{ color: "black" }}> Channel Manager </label>
                                        <select class="form-select" aria-label="Default select example" onChange={(e) => handleChannel(e.target.value)}>
                                            <option selected>Choose...</option>
                                            {
                                                props.options.map((item, key) => {
                                                    return (
                                                        <option>{item}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                ) : (
                                    null
                                )
                            }
                            {
                                props.channel || props.updatePriceWizard ? (
                                    <div className="modal-gap">
                                        <label style={{ color: "black" }}> {isChannel ? "Update Price" : "Update Room Price"} </label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder={isChannel ? "Update Price" : "Update Room Price"} name={updatePrice} value={updatePrice} onChange={(e) => updatePriceWizard(e.target.value)} />
                                    </div>
                                ) : (
                                    null
                                )
                            }
                            <div className='modal-gap'>
                                <label style={{ color: "black" }}> Date Of Check In - (Default Date is Today's Date!) </label>
                                <DatePicker style={{ color: "black" }} className="form-control" selected={Date.now()} excludeDates={excludeDates} dateFormat='y-MM-dd' minDate={new Date()} isClearable />
                            </div>
                            {/* Optional Date of checkout for normal bookers */}
                            <div className='modal-gap'>
                                <label style={{ color: "black" }}> Date Of Check Out </label>
                                <DatePicker style={{ color: "black" }} className="form-control" placeholderText='Checkout Date would go here...' excludeDates={excludeDates} selected={checkedoutdate} dateFormat='y-MM-dd' minDate={new Date()} onSelect = {(e) => checkAdvance(e)} onChange={((e) => setCheckedoutdate(e))} isClearable />
                            </div>
                            <div className="modal-gap">
                                <label style={{ color: "black" }}> Customer Name </label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Customer Name" name={customername} value={customername} onChange={(e) => setCustomername(e.target.value)} />
                            </div>
                            <div className='modal-gap'>
                                <label style={{ color: "black" }}> Customer Phone Number </label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Customer Phone Number' name={customerphonenumber} value={customerphonenumber} onChange={(e) => setCustomerphonenumber(e.target.value)} />
                            </div>
                            <div className='modal-gap'>
                                <label style={{ color: "black" }}> Customer Second Phone Number </label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Customer Second Phone Number' name={secondphonenumber} value={secondphonenumber} onChange={(e) => setSecondphonenumber(e.target.value)} />
                            </div>
                            <div className='modal-gap'>
                                <label style={{ color: "black" }}> Adults </label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='No.of.adults' name={adults} value={adults} onChange={(e) => restrictAdults(e.target.value, "CHECK-IN")} />
                                {inline.inlineAdults && (
                                    <InlineToast message={inline.inlineAdultsText} />
                                )}
                            </div>
                            <div className='modal-gap'>
                                <label style={{ color: "black" }}> Childrens If Any! </label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='No.of.childrens' name={childrens} value={childrens} onChange={(e) => restrictChildrens(e.target.value, "CHECK-IN")} />
                                {inline.inlineChildrens && (
                                    <InlineToast message={inline.inlineChildrensText} />
                                )}
                            </div>
                            {!isChannel && (
                                isExtra ? (
                                    <div className='modal-gap'>
                                        <label style={{ color: "black" }}> Extra Beds </label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Extra Beds' name={extraCount} value={extraCount} onChange={(e) => updateExtraCount(e.target.value)} />
                                    </div>
                                ) : (
                                    null
                                )
                            )}
                            <div className='modal-gap'>
                                <label style={{ color: "black" }}> ID Number of anyone adult </label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='ID Number' name={aadhar} value={aadhar} onChange={(e) => setAadhar(e.target.value)} />
                            </div>
                            {!isChannel && (
                                <div>
                                    <div className='modal-gap'>
                                        <label style={{ color: "black" }}> Advance Amount(Optional) </label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Advance Amount' name={advanceCheckin} value={advanceCheckin} onChange={(e) => restrictAdvance(e.target.value)} />
                                        {
                                            inline.inlineErrorAdvance ? (
                                                <InlineToast message={inline.inlineAdvanceText} />
                                            ) : (
                                                null
                                            )
                                        }
                                    </div>
                                    <div className='modal-gap'>
                                        <label style={{ color: "black" }}> Discount Amount(Optional) </label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Discount Amount' name={discount} value={discount} onChange={(e) => restrictDiscount(e.target.value)} />
                                        {
                                            inline.inlineErrorDiscount ? (
                                                <InlineToast message={inline.inlineDiscountText} />
                                            ) : (
                                                null
                                            )
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                          <Button className="btn btn-secondary" onClick={handleClose}>Close</Button>
                          <Button className='btn btn-outline' disabled={inline.inlineErrorDiscount} onClick={processData}> Save and Close </Button>
                      </Modal.Footer>
                  </Modal>
                )}

                {/* // Pre Book Modal  */}
                {props.isPrebook && (
                  <Modal
                      show={prebookmodal}
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      background="static"
                      className="text-center"
                  >
                      <Modal.Header>
                          <Modal.Title id="contained-modal-title-vcenter">
                              Pre Book Check In - Feautured
                          </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <div className = "checkin-modal">
                          <h4 className='strong'>{props.roomno}</h4>
                          <div className='modal-gap'>
                              <label style={{ color: "black" }}> Date & Time Of Check In </label>
                              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Date of checkin" name={props.excludeTime.checkinDate + " " + props.excludeTime.checkinTime} value={props.excludeTime.checkinDate + " " + props.excludeTime.checkinTime} />
                          </div>
                          <div className='modal-gap'>
                              <label style={{ color: "black" }}> Date & Timee Of Check Out </label>
                              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Date of checkout" name={props.excludeTime.checkoutDate + " " + props.excludeTime.checkoutTime} value={props.excludeTime.checkoutDate + " " + props.excludeTime.checkoutTime} />
                          </div>
                          <div className="modal-gap">
                              <label style={{ color: "black" }}> Customer Name </label>
                              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Customer Name" name={prebookusername} value={prebookusername} onChange={(e) => setPrebookusername(e.target.value)} />
                          </div>
                          <div className='modal-gap'>
                              <label style={{ color: "black" }}> Customer Phone Number </label>
                              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Customer Phone Number' name={prebookphonenumber} value={prebookphonenumber} onChange={(e) => setPrebookphonenumber(e.target.value)} />
                          </div>
                          <div className='modal-gap'>
                              <label style={{ color: "black" }}> Customer Second Phone Number </label>
                              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Customer Second Phone Number' name={prebooksecondnumber} value={prebooksecondnumber} onChange={(e) => setPrebooksecondnumber(e.target.value)} />
                          </div>
                          <div className='modal-gap'>
                              <label style={{ color: "black" }}> Adults </label>
                              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='No.of.adults' name={prebookadults} value={prebookadults} onChange={(e) => restrictAdults(e.target.value, "PRE-BOOK")} />
                              {inline.inlineAdults && (
                                  <InlineToast message={inline.inlineAdultsText} />
                              )}
                          </div>
                          <div className='modal-gap'>
                              <label style={{ color: "black" }}> Childrens If Any! </label>
                              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='No.of.childrens' name={prebookchildren} value={prebookchildren} onChange={(e) => restrictChildrens(e.target.value, "PRE-BOOK")} />
                              {inline.inlineChildrens && (
                                  <InlineToast message={inline.inlineChildrensText} />
                              )}
                          </div>
                          <div className='modal-gap'>
                              <label style={{ color: "black" }}> ID Number of anyone adult </label>
                              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='ID Number' name={prebookaadhar} value={prebookaadhar} onChange={(e) => setPrebookaadhar(e.target.value)} />
                          </div>
                          <div className='modal-gap'>
                              <label style={{ color: "black" }}> Advance Amount </label>
                              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Advance Amount' name={prebookadvance} value={prebookadvance} onChange={(e) => setPrebookadvance(e.target.value)} />
                          </div>
                          <div className='modal-gap'>
                              <label style={{ color: "black" }}> Discount (Optional) </label>
                              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Discount Amount' name={prebookdiscount} value={prebookdiscount} onChange={(e) => setPrebookdiscount(e.target.value)} />
                          </div>
                          </div>
                      </Modal.Body>
                      <Modal.Footer>
                          <Button className="btn btn-secondary" onClick={preBookModal}>Close</Button>
                          <Button className='btn btn-outline' onClick={processDataPreBook}> Save and Close </Button>
                      </Modal.Footer>
                  </Modal>
                )}
                {/* // Check Out Modal */}
                <Modal
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    background="static"
                    show={showmodal}
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {props.edit ? "Edit Customer Details" : "Check Out - Feautured"}
                        </Modal.Title>
                    </Modal.Header>
                    {
                        userdata.map((item, key) => {
                            return (
                                <ModalCheckOut updateDetails = {setEditDetails} isEdit = {props.edit} extraBeds={props.extraBeds} extraBedPrice={props.extraBedPrice} 
                                isHourly={props.isHourly} currentTime={getTime} checkInTime={item.checkinTime} 
                                discount={props.discount} roomno={props.roomno} username={item.username} phone={item.phonenumber} 
                                secondphonenumber={item.secondphonenumber} aadharcard={item.aadharcard} adults={item.adults} 
                                childrens={item.childrens} user={item._id} userid={setUserid} checkin={item.dateofcheckin} 
                                stayeddays={setStayeddays} checkoutdate={setCheckoutdate} tempData={item.dateofcheckout} isChannel = {item.channel} setChannel = {(value, channelName) => setChannel(prevState => ({...prevState, isChannel: value, channelName: channelName}))} />
                            )
                        })
                    }
                    <Modal.Footer>
                        <Button className="btn btn-secondary" onClick={handleModal}>Close</Button>
                        {props.edit ? (
                            <Button className="btn btn-info" onClick={() => updateOptions()}> Edit Details </Button>
                        ) : (
                            <Button className="btn btn-info" onClick={clearData}> Check-Out & Generate Bill </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                {/* Generated Bill */}
                <Modal
                    show={showGeneratedBill}
                    onHide={handleCloseGeneratedBill}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Generated Bill - Feautured</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div id="invoice-generator">
                            {
                                isWizard ? (
                                    <Wizard isError = {inline} close={true} class="text-center" label="Update Bill Price" placeholder="Update Bill Price" wizardInputChange={(data) => inputChangeWizard(data)} onClose={() => openUpdateWizard()} />
                                ) : (
                                    null
                                )
                            }
                            <h5>Amount to be paid for Room Rent - {channel.isChannel ? totalAmount : amount}
                                {
                                    props.updatePriceWizard ? (
                                        <span>
                                            {
                                                isWizard ? (
                                                    <span className="update-price-configured" onClick={() => updateBillPrice()}>
                                                        Update
                                                    </span>
                                                ) : (
                                                    <span className="update-price-configured" onClick={() => openUpdateWizard()}>
                                                        Edit
                                                    </span>
                                                )
                                            }
                                        </span>
                                    ) : (
                                        null
                                    )
                                }
                            </h5>
                            {
                                advance === true ? (
                                    <p>
                                        Advance amount has been reduced in the total amount - {amount_advance} Rs!
                                    </p>
                                ) : (
                                    null
                                )
                            }
                            {
                                discountApplied === true ? (
                                    <p>
                                        Discount amount has been reduced in the total amount - {discountPrice} Rs!
                                    </p>
                                ) : (
                                    null
                                )
                            }
                            {
                              Number(totalAmount) < 0 ? (
                                <p>
                                    Amount has to be returned to the customer: {getReturnAmount()}
                                </p>
                              ) : (
                                <p>
                                    Amount to be paid for the suite: {totalAmount}
                                </p>
                              )
                            }
                            {
                                isNaN(Number(totalAmount)) ? (
                                    <div>
                                        <p>
                                            Amount deducted for CGST - Calculating...
                                        </p>
                                        <p>
                                            Amount deducted for SGST - Calculating...
                                        </p>
                                    </div>
                                ) : (
                                    isGst === true ? (
                                        <div>
                                            <p>
                                                Amount deducted for GST: {determineGst()}
                                            </p>
                                        </div>
                                    ) : (
                                        <div>

                                        </div>
                                    )
                                )
                            }
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>
                                            Dish Name
                                        </th>
                                        <th>
                                            Quantity
                                        </th>
                                        <th>
                                            Dish Rate
                                        </th>
                                    </tr>
                                    {
                                        dishrate.map((item, key) => {
                                            return (
                                                <Table dishName={item.dishName} quantity={item.quantity} dishRate={item.dishRate} setTotaldishrate={setTotaldishrate} roomid={props.roomid} />
                                            )
                                        })
                                    }
                                </thead>
                            </table>
                            <p>
                                Total Amount to be paid for dish service - {isNaN(calcdishrate) ? "Calculating..." : calcdishrate}
                            </p>
                            {
                                isGst ? (
                                    <p>
                                        Total Amount to be paid for dish service with GST - {isNaN(calcdishrate) ? "Calculating..." : (calcdishrate * 0.05)}
                                    </p>
                                ) : (
                                    <div>
                                    </div>
                                )
                            }
                            {isExtra && (
                                <h5 style={{ fontWeight: "bold" }}>
                                    Amount for extra beds: {extraCollection} Rs
                                </h5>
                            )}
                            <h5 style={{ fontWeight: "bold" }}>Total amount to be paid:
                                {
                                    discountApplied === true ? (
                                        isNaN(Number(calcdishrate) + getTotalAmount()) ? (
                                            " Calculating..."
                                        ) : (
                                            (" " + (Number(calcdishrate) + getTotalAmount()) + " Rs")
                                        )
                                    ) : (
                                        isNaN(Number(calcdishrate) + getTotalAmount()) ? (
                                            " Calculating..."
                                        ) : (
                                            (" " + (Number(calcdishrate) + getTotalAmount()) + " Rs")
                                        )
                                    )
                                }
                            </h5>
                            {
                                isGst ? (
                                    <h5 style={{ fontWeight: "bold" }}>Total amount to be paid with GST:
                                        {
                                            discountApplied === true ? (
                                                isNaN(Number(calcdishrate) + getTotalAmount() + determineGst()) ? (
                                                    " Calculating..."
                                                ) : (
                                                    (" " + (Number(calcdishrate) + Number(calcdishrate * 0.05) + getTotalAmountWithGST()) + " Rs")
                                                )
                                            ) : (
                                                isNaN(Number(calcdishrate) + Number(totalAmount + extraCollection)) ? (
                                                    " Calculating..."
                                                ) : (
                                                    (" " + (Number(calcdishrate) + Number(calcdishrate * 0.05) + getTotalAmountWithGST()) + " Rs")
                                                )
                                            )
                                        }
                                    </h5>
                                ) : (
                                    <div>

                                    </div>
                                )
                            }

                            {/* Check for channel enabled! */}
                            {channel.isChannel && (
                                 <div className = "acknowledgement success-text">
                                    Already paid customer through {channel.channelName}
                                </div>
                            )}

                            {inputFieldInvoice.show && (
                                <Modals message = {inputFieldInvoice.inputField} show = {inputFieldInvoice.show} setShow = {(data) => setInputFieldInvoice({...inputFieldInvoice, show: data})} options = {inputFieldInvoice} generateInvoice = {(choices) => generateInvoice(choices)}  />
                            )}

                            {
                                !channel.isChannel && props.isGstEnabled ? ( // Only when channel manager is not enabled and GST matrix is checkec!
                                    <div>
                                        <div className="table-view-bill-line"></div>
                                        <div class="form-check gst-toggle">
                                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" onChange={() => gstHandler()} />
                                            <label class="form-check-label" for="flexCheckChecked">
                                                GST
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                    </div>
                                )
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>

                        {!channel.isChannel && (
                            <Button variant="secondary" onClick={handleCloseGeneratedBill}>
                                Not Paid
                            </Button>
                        )}
                        <Button variant = "btn btn-info" onClick={() => windowInvoice()}>Invoice</Button>
                        <Button variant="dark" onClick={() => windowPrint()}>Print</Button>
                        <Button variant="primary" onClick={checkedOut}>{channel.isChannel ? "Done" : "Paid"}</Button>
                    </Modal.Footer>
                </Modal>

                {/* Alert messages down here */}
                <div>
                    {
                        success == undefined ? (
                            <div>
                            </div>
                        ) : (
                            <Modal
                                show={showerror}
                                onHide={handleCloseModal}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Body className="text-center">
                                        {success}
                                    </Modal.Body>
                                </Modal.Header>
                            </Modal>
                        )
                    }
                </div>
                {!props.edit ? (
                        props.prebookconfig ? (
                            props.prevalid ? (
                                <div className="btn btn-success" onClick={preBookModal}>
                                    Pre Book
                                </div>
                              ) : (
                                <div className="btn btn-success disabled">
                                    Pre Book
                                </div>
                              )
                        ) : (
                          !props.edit && (
                              (props.engaged == "true" ? (
                                  <div className="btn btn-dark" onClick={getUserData}>
                                      Check-Out
                                  </div>
                              ) : (
                                  <div className="btn btn-info" onClick={handleClose}>
                                      Check-In
                                  </div>
                              )
                              )
                          ) 
                    )
                ) : (
                  <div className = "btn btn-success" onClick={getUserData}>
                      Edit Details
                  </div>
                )
              }
                
                {
                    <div>
                        {
                            loading ? (
                                <Modal
                                    show={loading}
                                    backdrop="static"
                                >
                                    <Modal.Body>
                                        Updating, please wait!
                                    </Modal.Body>
                                </Modal>
                            ) : (
                                <div>
                                </div>
                            )
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default HomeRoom
