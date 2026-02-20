import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";

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
  };

  module SemenStraw {
    public func compare(a : SemenStraw, b : SemenStraw) : Order.Order {
      Text.compare(a.strawId, b.strawId);
    };
  };

  let storage = Map.empty<Text, SemenStraw>();

  public shared ({ caller }) func addOrUpdateStraw(strawId : Text, bullId : Text, collectionDate : Text, quality : QualityGrade, storageLocation : Text) : async () {
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

  public query ({ caller }) func getAllStraws() : async [SemenStraw] {
    storage.values().toArray().sort();
  };

  public query ({ caller }) func getStrawById(strawId : Text) : async ?SemenStraw {
    storage.get(strawId);
  };
};
