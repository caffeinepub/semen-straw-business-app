import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Migration "migration";

(with migration = Migration.run)
actor {
  type QualityGrade = {
    #Superior;
    #Standard;
    #Substandard;
  };

  type AvailabilityStatus = {
    #Available;
    #Sold;
    #Used;
  };

  type SemenStraw = {
    strawId : Text;
    bullId : Text;
    collectionDate : Text;
    quality : QualityGrade;
    storageLocation : Text;
    status : AvailabilityStatus;
    quantity : Nat;
    colorCode : Text;
  };

  module SemenStraw {
    public func compare(a : SemenStraw, b : SemenStraw) : Order.Order {
      Text.compare(a.strawId, b.strawId);
    };
  };

  type Sale = {
    saleId : Text;
    strawId : Text;
    saleDate : Text;
    buyerName : Text;
    buyerContact : Text;
    quantitySold : Nat;
    salePrice : Float;
  };

  type SaleBill = {
    sale : Sale;
    straw : SemenStraw;
    totalAmount : Float;
  };

  let storage = Map.empty<Text, SemenStraw>();
  let sales = Map.empty<Text, Sale>();
  var nextSaleId = 0;

  public shared ({ caller }) func addOrUpdateStraw(strawId : Text, bullId : Text, collectionDate : Text, quality : QualityGrade, storageLocation : Text, quantity : Nat, colorCode : Text) : async () {
    if (strawId.isEmpty()) {
      Runtime.trap("Straw ID cannot be empty");
    };

    let straw : SemenStraw = {
      strawId;
      bullId;
      collectionDate;
      quality;
      storageLocation;
      status = #Available;
      quantity;
      colorCode;
    };

    storage.add(strawId, straw);
  };

  public shared ({ caller }) func updateStrawStatus(strawId : Text, newStatus : AvailabilityStatus) : async () {
    switch (storage.get(strawId)) {
      case (null) {
        Runtime.trap("Straw not found");
      };
      case (?straw) {
        let updatedStraw = {
          straw with
          status = newStatus;
        };
        storage.add(strawId, updatedStraw);
      };
    };
  };

  public shared ({ caller }) func transformStrawQuantity(strawId : Text, quantity : Nat) : async () {
    switch (storage.get(strawId)) {
      case (null) {
        Runtime.trap("Straw not found");
      };
      case (?straw) {
        let randomValue = 0;
        let newStatus = switch (randomValue % 3) {
          case (0) { #Available };
          case (1) { #Sold };
          case (2) { #Used };
          case (_) { #Available };
        };

        let updatedStraw = {
          straw with
          quantity;
          status = newStatus;
        };
        storage.add(strawId, updatedStraw);
      };
    };
  };

  public shared ({ caller }) func createSale(strawId : Text, saleDate : Text, buyerName : Text, buyerContact : Text, quantitySold : Nat, salePrice : Float) : async () {
    switch (storage.get(strawId)) {
      case (null) { Runtime.trap("Straw not found") };
      case (?straw) {
        if (straw.quantity < quantitySold) {
          Runtime.trap("Insufficient quantity available");
        };

        let saleId = nextSaleId.toText();
        let sale : Sale = {
          saleId;
          strawId;
          saleDate;
          buyerName;
          buyerContact;
          quantitySold;
          salePrice;
        };

        sales.add(saleId, sale);

        let updatedStraw = {
          straw with
          quantity = straw.quantity - quantitySold;
          status = if (straw.quantity - quantitySold == 0) { #Sold } else {
            straw.status;
          };
        };

        storage.add(strawId, updatedStraw);
        nextSaleId += 1;
      };
    };
  };

  public query ({ caller }) func getAllStraws() : async [SemenStraw] {
    storage.values().toArray().sort();
  };

  public query ({ caller }) func getStrawById(strawId : Text) : async ?SemenStraw {
    storage.get(strawId);
  };

  public query ({ caller }) func getAllSales() : async [Sale] {
    sales.values().toArray();
  };

  public query ({ caller }) func getSaleById(saleId : Text) : async ?Sale {
    sales.get(saleId);
  };

  public query ({ caller }) func generateSaleBill(saleId : Text) : async ?SaleBill {
    switch (sales.get(saleId)) {
      case (null) { null };
      case (?sale) {
        switch (storage.get(sale.strawId)) {
          case (null) { null };
          case (?straw) {
            ?{
              sale;
              straw;
              totalAmount = sale.quantitySold.toFloat() * sale.salePrice;
            };
          };
        };
      };
    };
  };
};
