import React, { useEffect, useState, useReducer, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { Button, Form, Spinner } from "react-bootstrap";
import { useDeviceStore } from "../../../stores/deviceStore";
import { deleteFileInStorage, getFileUrlStorage, uploadFileToStorage } from "../../../firebase/Storage";
import placeholder from "../../../utils/placeholder";
import Dropzone from "react-dropzone";
import styles from "../../../styles/components/Blog/BlogTemplate.module.scss";
import { BsCloudUpload, BsCurrencyExchange } from "react-icons/bs";
import { SiGoogletranslate } from "react-icons/si";
import { v4 as uuidv4 } from "uuid";
import { createDocFirestore, updateDocFields } from "../../../firebase/Firestore";
import SuccessModal from "../../Modals/SuccessModal";
import ProductCard from "../ProductCard";
import { useAuth } from "../../../context/AuthProvider";

function ProductTemplate(props) {
  const router = useRouter();
  const locale = router.locale;
  const prodEdit = props.product;
  const titleRef_en = useRef();
  const descRef_en = useRef();
  const priceRef_usd = useRef();

  const titleRef_pl = useRef();
  const descRef_pl = useRef();
  const priceRef_pln = useRef();

  const cardsRef = useRef();
  const categoryRef = useRef();

  const { setErrorMsg } = useAuth();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const [langPreview, setLangPreview] = useState(locale);
  const [showSuccess, setShowSuccess] = useState("");
  const [imgBase64, setImgBase64] = useState({ loaded: false, path: placeholder("pinkPX") }); //used only for preview
  const [imgFile, setImgFile] = useState(null); //image wich will be uploaded to the storage
  const [editNewImage, setEditNewImage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingExc, setLoadingExc] = useState(false);
  const invalidInit = {
    title: false,
    image: false,
    desc: false,
    price: false,
    cardSet: false,
    category: false,
  };
  const [invalid, updateInvalid] = useReducer((state, updates) => ({ ...state, ...updates }), invalidInit);
  const initProduct = {
    id: "",
    title: { en: "", pl: "" },
    desc: { en: "", pl: "" },
    price: { usd: { amount: 0, currency: "usd", s_id: "" }, pln: { amount: 0, currency: "pln", s_id: "" } },
    cardSet: 0,
    image: {
      name: "",
      path: "",
    },
    category: "",
    createDate: null,
    active: true,
  };
  const [product, updateProduct] = useReducer((state, updates) => ({ ...state, ...updates }), initProduct);
  const [previewProduct, setPreviewProduct] = useState(null);
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light" : "";

  const t = {
    en: {
      home: "Home",
      productsMenagement: "Products Menagment",
      newProduct: "New Product",
      loading: "Loading...",
      mainPicture: "Main Picture",
      selectAnother: "Select another",
      selectOrDrop: "Select or Drop another file",
      dragAndDrop: "Drag 'n' drop some files here",
      orSelect: "or click to select files",
      cards: "Cards quantity:",
      category: "Category:",
      price: "Price:",
      preview: "Preview Product",
      closePreview: "Close Preview",
      love: "Love",
      success: "Success",
      celticCross: "Celtic cross",
      spiritual: "Spiritual",
      careerPath: "Career Path",
      threeCard: "Three Card",
      createProduct: "Create This Product!",
      saveChanges: "Save Changes!",
      uploadPicture: "Please upload main picture.",
      addTitle: "Please add name of the product.",
      addDesc: "Please add the description.",
      addCards: "Add quantity of cards.",
      addPrice: "Please add the price.",
      converting: "Converting...",
      convertTitle: "Convert price to the choosen currency",
      modalButton: "Close",
      sthWrong: "Something went wrong, please try again later.",
      successEdited: "Product edited successfuly!",
      successAdded: "Product created successfuly!",
    },
    pl: {
      home: "Strona Główna",
      productsMenagement: "Panel Produktów",
      newProduct: "Nowy Produkt",
      loading: "Ładuję..",
      mainPicture: "Zdjęcie Główne",
      selectAnother: "Wybierz inne",
      selectOrDrop: "Wybierz plik lub upuść tutaj",
      dragAndDrop: "Upuść plik tutaj,",
      orSelect: "lub kliknij, aby wybrać.",
      cards: "Ilość kart:",
      category: "Kategoria:",
      price: "Cena:",
      preview: "Podgląd Produktu",
      closePreview: "Zamknij podgląd",
      love: "Miłość",
      success: "Sukces",
      celticCross: "Krzyż celtycki",
      spiritual: "Duchowość",
      careerPath: "Kariera",
      threeCard: "3 karty",
      createProduct: "Dodaj ten Produkt!",
      saveChanges: "Zapisz zmiany!",
      uploadPicture: "Proszę dodać zdjęcie produktu.",
      addTitle: "Proszę dodać nazwę produktu.",
      addDesc: "Proszę dodać opis produktu.",
      addCards: "Dodaj ilość kart.",
      addPrice: "Dodaj cenę produktu.",
      converting: "Konwertuję...",
      convertTitle: "Przelicz cenę zgodnie z kursem USD/PLN",
      modalButton: "Zamknij",
      sthWrong: "Coś poszło nie tak, spróbuj ponownie później.",
      successEdited: "Produkt pomyślnie zaktualizowany!",
      successAdded: "Produkt pomyślnie dodany!",
    },
  };

  useEffect(() => {
    if (prodEdit) {
      getFileUrlStorage(`images/products/${prodEdit.id}`, prodEdit.image.name)
        .then((url) => {
          setImgBase64({ loaded: true, path: url }); //set url instead of base64
          updateInvalid({ image: false }); //main img setted
        })
        .catch((error) => console.log(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  const onDropFunc = (files) => {
    imgToBase64(files);
    setImgFile(files[0]);
    setEditNewImage(true);
  };

  //Convert eg. main image to to base64 to display it on the client without uploading files to the firebase storage
  const imgToBase64 = (files) => {
    updateInvalid({ image: false });
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgBase64({ loaded: true, path: reader.result });
    };
    reader.readAsDataURL(files[0]);
  };

  const handlePreview = async () => {
    let dataOK = true;
    const uid = uuidv4().slice(0, 13);

    // check title/name field
    if (titleRef_en.current?.value != "" && titleRef_pl.current?.value != "") {
      updateInvalid({ title: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ title: true }); //invalid
      document.getElementsByName("ProdAdminTmpTitleEN")[0].focus();
      document.getElementsByName("ProdAdminTmpTitleEN")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }
    // check if main image was added
    if (imgBase64.loaded) {
      updateInvalid({ image: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ image: true }); //invalid
      document.getElementsByName("ProdAdminTmpImg")[0].focus();
      document.getElementsByName("ProdAdminTmpImg")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }
    // check if description is added
    if (descRef_en.current?.value != "" && descRef_pl.current?.value != "") {
      updateInvalid({ desc: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ desc: true }); //invalid
      document.getElementsByName("ProdAdminTmpDescEN")[0].focus();
      document.getElementsByName("ProdAdminTmpDescEN")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }

    // check if cards quantity is added
    if (cardsRef.current?.value > 0) {
      updateInvalid({ cardSet: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ cardSet: true }); //invalid
      document.getElementsByName("ProdAdminTmpCards")[0].focus();
      document.getElementsByName("ProdAdminTmpCards")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }

    // check if prices are added
    if (priceRef_usd.current?.value > 0 && priceRef_pln.current?.value > 0) {
      updateInvalid({ price: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ price: true }); //invalid
      document.getElementsByName("ProdAdminTmpPrice")[0].focus();
      document.getElementsByName("ProdAdminTmpPrice")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }

    if (dataOK) {
      const data = {
        id: `${prodEdit ? prodEdit.id : uid}`,
        image: {
          name: "",
          path: imgBase64.path, //used for preview image without uploading to the firestorage
        },
        title: { en: titleRef_en.current?.value, pl: titleRef_pl.current?.value },
        desc: { en: descRef_en.current?.value, pl: descRef_pl.current?.value },
        price: {
          usd: {
            amount: parseFloat(priceRef_usd.current?.value).toFixed(2),
            currency: "usd",
            prod_id: prodEdit ? prodEdit.price.usd.prod_id : "",
            s_id: prodEdit ? prodEdit.price.usd.s_id : "",
          },
          pln: {
            amount: parseFloat(priceRef_pln.current?.value).toFixed(2),
            currency: "pln",
            prod_id: prodEdit ? prodEdit.price.pln.prod_id : "",
            s_id: prodEdit ? prodEdit.price.pln.s_id : "",
          },
        },
        cardSet: cardsRef.current?.value,
        category: categoryRef.current?.value,
        createDate: prodEdit ? timeStampToDate(prodEdit.createDate) : new Date(),
        active: true,
      };
      updateProduct({ ...data }); //data for the database

      data.title = data.title[langPreview];
      data.desc = data.desc[langPreview];
      setPreviewProduct(data); //data for the preview

      setShowPreview(!showPreview);
    }
  };

  // Upload main picture and add Stripe products
  const prepareData = async () => {
    try {
      let readyProduct = { ...product };
      let imgUrl = "";

      //upload main picture to the storage
      if (editNewImage) {
        //true when adding new product mode and when admin change the image in editing mode
        imgUrl = await uploadFileToStorage(imgFile, `images/products/${product.id}`);
        if (prodEdit) {
          readyProduct.image.name = imgFile.name;
          readyProduct.image.path = imgUrl;
          await deleteFileInStorage(`images/products/${prodEdit.id}`, prodEdit.image.name); // delete the old image from the storage
        }
      } else {
        imgUrl = prodEdit.image.path;
        readyProduct.image.name = prodEdit.image.name;
        readyProduct.image.path = prodEdit.image.path;
      }

      // Add/Update Stripe products
      if (prodEdit) {
        const res = await updateStripeProduct("en", "usd", imgUrl);
        res && (readyProduct.price.usd.s_id = res.data.default_price);

        const res_pl = await updateStripeProduct("pl", "pln", imgUrl);
        res_pl && (readyProduct.price.pln.s_id = res_pl.data.default_price);
      } else {
        readyProduct.image = imgFile.name; //use file name instead of path for the firestore product data
        const res = await addStripeProduct("en", "usd", imgUrl);
        if (res.status == 200) {
          readyProduct.price.usd.prod_id = res.data.id;
          readyProduct.price.usd.s_id = res.data.default_price;
          const res_pl = await addStripeProduct("pl", "pln", imgUrl);
          if (res_pl.status == 200) {
            readyProduct.price.pln.prod_id = res_pl.data.id;
            readyProduct.price.pln.s_id = res_pl.data.default_price;
          }
        }
      }
      return readyProduct;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addStripeProduct = async (lang, ccy, imgUrl) => {
    const payload = {
      secret: process.env.NEXT_PUBLIC_API_KEY,
      mode: "create",
      data: {
        name: product.title[lang],
        // desc: product.desc[lang],
        images: [imgUrl],
        default_price_data: {
          unit_amount: Math.trunc(product.price[ccy].amount * 100), //price in cents, eg. 2000 means 20$ or 20pln etc.
          currency: product.price[ccy].currency,
        },
      },
    };
    try {
      return await axios.post("/api/stripe/products", payload);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateStripeProduct = async (lang, ccy, imgUrl) => {
    let tmpData = null;
    let tmpPrice = null;

    if (product.title[lang] != prodEdit.title[lang]) {
      tmpData = { ...tmpData, name: product.title[lang] };
    }

    // if (product.desc[lang] != prodEdit.desc[lang]) {
    //   tmpData = { ...tmpData, description: product.desc[lang] };
    // }

    if (product.price[ccy].amount != prodEdit.price[ccy].amount) {
      tmpPrice = {
        product: prodEdit.price[ccy].prod_id,
        unit_amount: Math.trunc(product.price[ccy].amount * 100),
        currency: product.price[ccy].currency,
      };
    }

    if (imgUrl != "") {
      tmpData = { ...tmpData, images: [imgUrl] };
    }

    const payload = {
      secret: process.env.NEXT_PUBLIC_API_KEY,
      mode: "update",
      data: { prod: tmpData, price: tmpPrice, id: prodEdit.price[ccy].prod_id },
    };
    if (tmpData || tmpPrice) {
      try {
        return await axios.post("/api/stripe/products", payload);
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      return null;
    }
  };

  const createProduct = async () => {
    setLoading(true);
    try {
      const readyProduct = await prepareData();
      if (prodEdit) {
        //edit existing product
        await updateDocFields("products", readyProduct.id, readyProduct);
      } else {
        //create new product
        await createDocFirestore("products", readyProduct.id, readyProduct);
      }
      const revalidateData = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        paths: ["/admin/products", "/"],
      };
      if (prodEdit) {
        revalidateData.paths.push(`/product/${readyProduct.id}`);
      }

      await axios.post("/api/revalidate", revalidateData);
      setShowSuccess(prodEdit ? t[locale].successEdited : t[locale].successAdded);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setErrorMsg(t[locale].sthWrong);
      setLoading(false);
    }
  };

  const exchangeAmount = async () => {
    setLoadingExc(true);
    const pln = priceRef_pln.current.value;
    const usd = priceRef_usd.current.value;
    const have = usd > 0 ? "USD" : pln > 0 ? "PLN" : "USD";
    const want = have === "USD" ? "PLN" : "USD";
    const amount = have === "USD" ? usd : pln;

    const options = {
      method: "GET",
      url: "https://api.api-ninjas.com/v1/convertcurrency",
      params: { have: have, want: want, amount: amount },
      headers: {
        "X-Api-Key": process.env.NEXT_PUBLIC_NINJAS_KEY,
      },
    };

    try {
      const res = await axios.request(options);
      if (want === "USD") {
        priceRef_usd.current.value = res.data.new_amount;
      } else {
        priceRef_pln.current.value = res.data.new_amount;
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingExc(false);
  };

  const translateText = async (inputText, outputText, from, to) => {
    let translatedTxt = "";
    if (inputText != "") {
      try {
        const res = await axios.get(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(
            inputText
          )}`
        );
        res.data[0].map((text) => {
          translatedTxt += text[0];
        });
        outputText.current.value = translatedTxt;
        // console.log(translatedTxt);
      } catch (error) {
        console.log(error);
        setErrorMsg(t[locale].sthWrong);
      }
    } else {
      outputText.current.value = "";
    }
  };

  return (
    <>
      <section className="d-flex gap-1 mb-2">
        <small>
          <Link href="/">{t[locale].home}</Link>
        </small>
        <small>&gt;</small>
        <small>
          <Link href="/admin/products#main">{t[locale].productsMenagement}</Link>
        </small>
        <small>&gt;</small>
        <small>{prodEdit ? prodEdit.id : t[locale].newProduct}</small>
      </section>

      <div className={`d-flex align-items-center ${isMobile && "flex-wrap"}`}>
        {/* Main picture & DropZone */}
        <div className={`col-12 col-md-3 ${!isMobile && "pe-3"}`}>
          <p className="text-start mb-0">{t[locale].mainPicture}:</p>
          <div
            name="ProdAdminTmpImg"
            className={`border  rounded ${invalid.image && "border-danger"}`}
            style={{ minHeight: "170px", position: "relative" }}
          >
            <Dropzone onDrop={(acceptedFiles) => onDropFunc(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <section style={{ position: "relative", zIndex: 100 }}>
                  <div
                    className={`${
                      imgBase64.loaded ? styles.DropSectionLoaded : styles.DropSection
                    } color-primary pointer`}
                    style={{ minHeight: "170px" }}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <div className="mt-1">
                      {imgBase64.loaded ? (
                        <>
                          {isMobile ? (
                            <p className="border rounded p-1 me-1 text-light">
                              <small>{t[locale].selectAnother}</small>
                            </p>
                          ) : (
                            <p className={`${styles.pSelect} border rounded p-1 me-2 text-light`}>
                              <small>{t[locale].selectOrDrop}</small>
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-muted text-uppercase">{t[locale].mainPicture}</p>
                          <p className="mb-2">
                            {t[locale].dragAndDrop}
                            <br />
                            {t[locale].orSelect}
                          </p>
                          <BsCloudUpload style={{ width: "25px", height: "25px" }} />
                        </>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>
            <Image
              src={imgBase64.path}
              fill
              alt="uploaded file"
              style={{ borderRadius: ".25rem", objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          {invalid.image && (
            <div className="text-start mt-0">
              <small className="text-danger">{t[locale].uploadPicture}</small>
            </div>
          )}
        </div>

        <div className="col-12 col-md-9">
          {/* Name of the product */}
          <section className="mt-2 mb-3">
            <Form className={`d-flex text-start align-items-end ${isMobile && "flex-wrap"}`}>
              <div className={`w-100 ${!isMobile && "me-2"}`}>
                <Form.Label style={{ position: "relative", top: "8px" }}>Name of the product:</Form.Label>
                <Form.Control
                  type="text"
                  name="ProdAdminTmpTitleEN"
                  placeholder="Add name"
                  ref={titleRef_en}
                  onChange={() => setShowPreview(false)}
                  defaultValue={prodEdit ? prodEdit.title.en : ""}
                  className={`${invalid.title && "border border-danger"} w-100 ${themeDarkInput}`}
                />
                {isMobile && locale == "pl" && (
                  <div style={{ height: "0" }}>
                    <Button
                      variant={`outline-${theme == "dark" ? "light" : "dark"}`}
                      size="sm"
                      className="d-flex align-items-center ms-auto me-0"
                      style={{ position: "relative", top: "-35px", right: "3px" }}
                      onClick={() => {
                        translateText(titleRef_pl.current.value, titleRef_en, "pl", "en");
                      }}
                    >
                      <SiGoogletranslate style={{ width: "22px", height: "22px" }} />
                    </Button>
                  </div>
                )}
              </div>

              {!isMobile && (
                <div>
                  <Button
                    variant={`outline-${theme == "dark" ? "light" : "accent1"}`}
                    className="d-flex align-items-center"
                    onClick={() => {
                      locale == "en" && translateText(titleRef_en.current.value, titleRef_pl, "en", "pl");
                      locale == "pl" && translateText(titleRef_pl.current.value, titleRef_en, "pl", "en");
                    }}
                  >
                    <SiGoogletranslate style={{ width: "22px", height: "22px" }} />
                  </Button>
                </div>
              )}

              <div className={`w-100 ${!isMobile && "ms-2"}`}>
                <Form.Label style={{ position: "relative", top: "8px" }}>Nazwa produktu:</Form.Label>
                <Form.Control
                  type="text"
                  name="ProdAdminTmpTitlePL"
                  placeholder="Dodaj nazwę"
                  ref={titleRef_pl}
                  onChange={() => setShowPreview(false)}
                  defaultValue={prodEdit ? prodEdit.title.pl : ""}
                  className={`${invalid.title && "border border-danger"} w-100 ${themeDarkInput}`}
                />
                {isMobile && locale == "en" && (
                  <div style={{ height: "0" }}>
                    <Button
                      variant={`outline-${theme == "dark" ? "light" : "dark"}`}
                      size="sm"
                      className="d-flex align-items-center ms-auto me-0"
                      style={{ position: "relative", top: "-35px", right: "3px" }}
                      onClick={() => {
                        translateText(titleRef_en.current.value, titleRef_pl, "en", "pl");
                      }}
                    >
                      <SiGoogletranslate style={{ width: "22px", height: "22px" }} />
                    </Button>
                  </div>
                )}
              </div>
            </Form>
            {invalid.title && <small className="text-danger">{t[locale].addTitle}</small>}
            {isMobile && (
              <div className="mt-3 pt-1">
                <hr />
              </div>
            )}
          </section>

          {/* Description */}
          <section className="mb-3">
            <Form className={`d-flex text-start align-items-center ${isMobile && "flex-wrap"}`}>
              <div className={`w-100 ${!isMobile && "me-2"}`}>
                <Form.Label style={{ position: "relative", top: "8px" }}>Description:</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  name="ProdAdminTmpDescEN"
                  placeholder="Add some text..."
                  ref={descRef_en}
                  onChange={() => setShowPreview(false)}
                  defaultValue={prodEdit ? prodEdit.desc.en : ""}
                  className={`${invalid.desc && "border border-danger"} w-100 ${themeDarkInput}`}
                />
                {isMobile && locale == "pl" && (
                  <div style={{ height: "0" }}>
                    <Button
                      variant={`outline-${theme == "dark" ? "light" : "dark"}`}
                      size="sm"
                      className="d-flex align-items-center ms-auto me-0"
                      style={{ position: "relative", top: "-35px", right: "3px" }}
                      onClick={() => {
                        translateText(descRef_pl.current.value, descRef_en, "pl", "en");
                      }}
                    >
                      <SiGoogletranslate style={{ width: "22px", height: "22px" }} />
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-4">
                {!isMobile && (
                  <Button
                    variant={`outline-${theme == "dark" ? "light" : "accent1"}`}
                    className="d-flex align-items-center"
                    onClick={() => {
                      locale == "en" && translateText(descRef_en.current.value, descRef_pl, "en", "pl");
                      locale == "pl" && translateText(descRef_pl.current.value, descRef_en, "pl", "en");
                    }}
                  >
                    <SiGoogletranslate style={{ width: "22px", height: "22px" }} />
                  </Button>
                )}
              </div>
              <div className={`w-100 ${!isMobile && "ms-2"}`}>
                <Form.Label style={{ position: "relative", top: "8px" }}>Opis:</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  name="ProdAdminTmpDescPL"
                  placeholder="Dodaj opis..."
                  ref={descRef_pl}
                  onChange={() => setShowPreview(false)}
                  defaultValue={prodEdit ? prodEdit.desc.pl : ""}
                  className={`${invalid.desc && "border border-danger"} w-100 ${themeDarkInput}`}
                />
                {isMobile && locale == "en" && (
                  <div style={{ height: "0" }}>
                    <Button
                      variant={`outline-${theme == "dark" ? "light" : "dark"}`}
                      size="sm"
                      className="d-flex align-items-center ms-auto me-0"
                      style={{ position: "relative", top: "-35px", right: "3px" }}
                      onClick={() => {
                        translateText(descRef_en.current.value, descRef_pl, "en", "pl");
                      }}
                    >
                      <SiGoogletranslate style={{ width: "22px", height: "22px" }} />
                    </Button>
                  </div>
                )}
              </div>
            </Form>
            {invalid.desc && <small className="text-danger">{t[locale].addDesc}</small>}
          </section>
        </div>
      </div>

      {/* Attributes */}
      <section className="mt-2 mb-2">
        <Form className="text-start d-flex gap-md-2 flex-wrap align-items-top justify-content-center">
          {/* Cards */}
          <div className={`col-md-2 col-6 ${isMobile && "pe-2"}`}>
            <Form.Label style={{ position: "relative", top: "8px" }}>{t[locale].cards}</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="16"
              step="any"
              name="ProdAdminTmpCards"
              ref={cardsRef}
              onChange={() => setShowPreview(false)}
              defaultValue={prodEdit ? prodEdit.cardSet : 0}
              className={`${invalid.cardSet && "border border-danger"} ${themeDarkInput}`}
            />
            {invalid.cardSet && <small className="text-danger">{t[locale].addCards}</small>}
          </div>
          {/* Category */}
          <div className="col-md-2 col-6">
            <Form.Label style={{ position: "relative", top: "8px" }}>{t[locale].category}</Form.Label>
            <Form.Select
              type="text"
              name="ProdAdminTmpCategory"
              ref={categoryRef}
              onChange={() => setShowPreview(false)}
              defaultValue={prodEdit ? prodEdit.category : 0}
              className={themeDarkInput}
            >
              <option value="love">{t[locale].love}</option>
              <option value="success">{t[locale].success}</option>
              <option value="celtic-cross">{t[locale].celticCross}</option>
              <option value="spiritual">{t[locale].spiritual}</option>
              <option value="career-path">{t[locale].careerPath}</option>
              <option value="three-card">{t[locale].threeCard}</option>
            </Form.Select>
          </div>
          {/* Prices */}
          <div className="col-md-4 col-12" name="ProdAdminTmpPrice">
            <Form.Label style={{ position: "relative", top: "8px" }}>{t[locale].price}</Form.Label>
            <div className="d-flex gap-1">
              <Form.Control
                type="number"
                min="0"
                step="any"
                ref={priceRef_usd}
                onChange={() => setShowPreview(false)}
                defaultValue={prodEdit ? prodEdit.price.usd.amount : 0}
                className={`${invalid.price && "border border-danger"} ${themeDarkInput}`}
              />
              <span className="text-muted" style={{ position: "relative", right: "70px", top: "4px", width: "0px" }}>
                USD
              </span>
              <Form.Control
                type="number"
                min="0"
                step="any"
                ref={priceRef_pln}
                onChange={() => setShowPreview(false)}
                defaultValue={prodEdit ? prodEdit.price.pln.amount : 0}
                className={`${invalid.price && "border border-danger"} ${themeDarkInput}`}
              />
              <span className="text-muted" style={{ position: "relative", right: "70px", top: "4px", width: "0px" }}>
                PLN
              </span>
            </div>
            {invalid.price && <small className="text-danger">{t[locale].addPrice}</small>}
          </div>
          <div
            className={`col-md-2 col-12 d-flex  
            ${invalid.cardSet || invalid.price ? "align-items-center" : "align-items-end"}`}
          >
            <Button
              className={`w-100 ${isMobile && "mt-3"}`}
              variant={`outline-${theme == "dark" ? "light" : "dark"}`}
              onClick={exchangeAmount}
              disabled={loadingExc}
              title={t[locale].convertTitle}
            >
              {loadingExc ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span> {t[locale].converting}</span>
                </>
              ) : (
                <>
                  USD <BsCurrencyExchange /> PLN
                </>
              )}
            </Button>
          </div>
        </Form>
      </section>

      <div className="text-end mt-4">
        <Button onClick={handlePreview}>{showPreview ? t[locale].closePreview : t[locale].preview}</Button>
        <Button
          className="ms-1"
          variant="outline-primary"
          onClick={() => {
            setLangPreview(langPreview == "en" ? "pl" : "en");
            setShowPreview(false);
          }}
        >
          <span className="text-uppercase">{langPreview}</span>
        </Button>
      </div>
      {showPreview && (
        <div className="mt-4">
          <hr />
          <div className="d-flex justify-content-center text-start">
            <ProductCard product={previewProduct} preview={true} />
          </div>
          <hr className="mt-5" />
          <div>
            <Button
              onClick={createProduct}
              className="w-100"
              variant={showSuccess ? "success" : "primary"}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span> {t[locale].loading}</span>
                </>
              ) : (
                <span className="text-uppercase">{prodEdit ? t[locale].saveChanges : t[locale].createProduct}</span>
              )}
            </Button>
          </div>
        </div>
      )}
      {showSuccess && (
        <SuccessModal
          msg={showSuccess}
          btn={t[locale].modalButton}
          closeFunc={() => {
            router.push("/admin/products#main");
            setShowSuccess("");
          }}
        />
      )}
    </>
  );
}

export default ProductTemplate;
