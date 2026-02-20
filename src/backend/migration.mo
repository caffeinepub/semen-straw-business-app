import Map "mo:core/Map";
import Text "mo:core/Text";

module {
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

  type OldSemenStraw = {
    strawId : Text;
    bullId : Text;
    collectionDate : Text;
    quality : QualityGrade;
    storageLocation : Text;
    status : AvailabilityStatus;
  };

  type OldActor = {
    storage : Map.Map<Text, OldSemenStraw>;
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

  type NewSemenStraw = {
    strawId : Text;
    bullId : Text;
    collectionDate : Text;
    quality : QualityGrade;
    storageLocation : Text;
    status : AvailabilityStatus;
    quantity : Nat;
  };

  type NewActor = {
    storage : Map.Map<Text, NewSemenStraw>;
    sales : Map.Map<Text, Sale>;
    nextSaleId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newStorage = old.storage.map<Text, OldSemenStraw, NewSemenStraw>(
      func(_id, oldStraw) {
        { oldStraw with quantity = 1 };
      }
    );
    let sales = Map.empty<Text, Sale>();
    {
      storage = newStorage;
      sales;
      nextSaleId = 0;
    };
  };
};
