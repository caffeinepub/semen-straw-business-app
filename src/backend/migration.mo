import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
  // Quality grade type stays the same
  type QualityGrade = {
    #Superior;
    #Standard;
    #Substandard;
  };

  // Availability status type stays the same
  type AvailabilityStatus = {
    #Available;
    #Sold;
    #Used;
  };

  // Old semen straw type (without color)
  type OldSemenStraw = {
    strawId : Text;
    bullId : Text;
    collectionDate : Text;
    quality : QualityGrade;
    storageLocation : Text;
    status : AvailabilityStatus;
    quantity : Nat;
  };

  // New semen straw type (with color code)
  type NewSemenStraw = {
    strawId : Text;
    bullId : Text;
    collectionDate : Text;
    quality : QualityGrade;
    storageLocation : Text;
    status : AvailabilityStatus;
    quantity : Nat;
    colorCode : Text;
  };

  // Sale type stays the same
  type Sale = {
    saleId : Text;
    strawId : Text;
    saleDate : Text;
    buyerName : Text;
    buyerContact : Text;
    quantitySold : Nat;
    salePrice : Float;
  };

  type OldActor = {
    storage : Map.Map<Text, OldSemenStraw>; // Old semen straw type
    sales : Map.Map<Text, Sale>;
    nextSaleId : Nat;
  };

  type NewActor = {
    storage : Map.Map<Text, NewSemenStraw>; // New type (with color)
    sales : Map.Map<Text, Sale>;
    nextSaleId : Nat;
  };

  // Migration function called by the main actor via with-clause
  public func run(old : OldActor) : NewActor {
    let newStorage = old.storage.map<Text, OldSemenStraw, NewSemenStraw>(
      func(_strawId, oldSemenStraw) {
        { oldSemenStraw with colorCode = "unknown" };
      }
    );
    {
      old with
      storage = newStorage;
    };
  };
};
