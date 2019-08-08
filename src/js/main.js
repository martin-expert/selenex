
$(document).ready(function () {
    function showElem(obj) {
        obj.forEach(function (elm) {
            elm.show();
        })
    }

    function hideElem(obj) {
        obj.forEach(function (elm) {
            elm.hide();
        })
    }

    function isShowHideElements(forShow, forHide) {
        showElem(forShow);
        hideElem(forHide);
    }

    window.scroll({
        top: 0,
        behavior: 'smooth'
    });

    // Bootstrap tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // section faq
    const FAQ_ACTIVE_CLASS = 'faq__item--is-show';

    let $parent = $('.faq__list');

    $parent.find('.faq__item').click(function () {
        $(this).toggleClass(FAQ_ACTIVE_CLASS);
    });

    // section header
    const SHOW_TOP_DETAIL = 'header__main--is-detail';

    let $topPanel = $('.header__main'),
        $topLink = $topPanel.find('.header__left');

    $topLink.click(function () {

        // $topPanel.toggleClass(SHOW_TOP_DETAIL);
    });

    // Scrips to checkout components
    const
        PLAN_ACTIVE_CLASS = 'product-plan__card--is-active',
        DEFAULT_PLAN = 2;

    let
        $planCard = $('.product-plan__card[data-product]'),
        currency = '$',
        productList = [
            {
                id: 1,
                name: '1 Bottle of Selenex GSH',
                img: 'botle.jpg',
                price: '39.95',
                sales: '21%',
                additional: '',
                shipping: 6.95
            },
            {
                id: 2,
                name: '3 Bottle of Selenex GSH  + 1 Free',
                img: 'botle_plus_1.jpg',
                price: 119.85,
                sales: '21%',
                additional: '+ Free Shipping',
                shipping: 0
            },
            {
                id: 3,
                name: '5 Bottles of Selenex GSH + 2 Free',
                img: 'botle_plus_2.jpg',
                price: 199.75,
                sales: '21%',
                additional: '+ Free Shipping',
                shipping: 0
            },
        ],
        $attrSubtotal = $('[data-subtotal]'),
        $attrShipping = $('[data-shipping]'),
        $attrTotalPrice = $('[data-total-price]'),
        $attrCaption = $('[data-caption]'),
        $attrDescription = $('[data-description]'),
        $attrSale = $('[data-sale]'),
        $attrChoosePlan = $('[data-choose-plan]');

    chooseProduct = (activeElm) => {
        productList.forEach(function (item) {
            if (activeElm == item.id) {

                let subTotal = eval(item.price) - eval(item.shipping),
                    totalPrice = eval(item.price) + eval(item.shipping);

                totalPrice = (Math.round(totalPrice * 10) / 10).toFixed(2);

                console.log('subTotal', subTotal);
                console.log('totalPrice', totalPrice);

                $attrCaption.text(item.name);
                $attrDescription.text(item.additional);
                $attrSale.text(item.sales);

                $attrChoosePlan.attr('data-choose-plan', item.id);
                $attrChoosePlan.find('img').attr('src', 'images/' + item.img);

                $attrSubtotal.text(currency + item.price);
                $attrShipping.text(currency + item.shipping);
                $attrTotalPrice.text(currency + totalPrice);
            }
        });

        planCartActive(activeElm);
    };

    planCartActive = (elm) => {
        $planCard.removeClass(PLAN_ACTIVE_CLASS);

        $("[data-product='" + elm + "']").toggleClass(PLAN_ACTIVE_CLASS);
    };

    $planCard.click(function () {
        let atr = $(this).attr('data-product');

        chooseProduct(atr);
        chooseCheckout(atr);
    });

    chooseProduct(DEFAULT_PLAN);

    let $creditCardRadio = $('#billCreditCard'),
        $payPalRadio = $('#billPayPal'),

        $sameAddrRadio = $('#billAddressSame'),
        $differentAdrrRadio = $('#billAddressDifferent');

    paymentMethod = () => {
        let $methodCC = $('#methodCreditCard'),
            $methodPP = $('#methodPayPal');

        if ($creditCardRadio.is(":checked")) {
            isShowHideElements([$methodCC], [$methodPP]);
        } else if ($payPalRadio.is(":checked")) {
            isShowHideElements([$methodPP], [$methodCC]);
        }
    };

    billingAddress = () => {
        let $addrDiff = $('#AddressDifferent');

        if ($sameAddrRadio.is(":checked")) {
            isShowHideElements([], [$addrDiff]);
        } else if ($differentAdrrRadio.is(":checked")) {
            isShowHideElements([$addrDiff], []);
        }
    };

    paymentMethod();
    billingAddress();

    $creditCardRadio.change(paymentMethod);
    $payPalRadio.change(paymentMethod);

    $sameAddrRadio.change(billingAddress);
    $differentAdrrRadio.change(billingAddress);
});



/* Custom Script */
    
$(document).ready(function() {
  $('.iframe-wrapper[data-product="2"]').show();
  $('.product-plan__card .orderBtn').click(function(e) {
    e.preventDefault();
    var $productWrapper = $(this).closest('.product-plan__card');
    if (typeof $productWrapper.attr('data-product') != 'undefined') {
      var productId = $productWrapper.attr('data-product');
      var dstLink = $(this).attr('href');

      var elemTop = $(dstLink).offset().top;
      var headerHeight = $('header.header').outerHeight(true);

      chooseCheckout(productId);
      window.scroll({
        top: (elemTop - headerHeight),
        behavior: 'smooth'
      });
      // $("html, body").animate({
      //   scrollTop: (elemTop - headerHeight) 
      // }, 600);
    }
  });

  var headerHeight = $('header.header').outerHeight(true);
  $('body').css('padding-top', headerHeight + 'px');
});

function chooseCheckout(productId) {
  /* Display Selected Checkout Page */
    var $targetProduct = $(`.iframe-wrapper[data-product="${productId}"]`);
    if ($targetProduct.length > 0) {
      $(`.iframe-wrapper:not([data-product="${productId}"])`).hide();
      $targetProduct.show();
    }
}

