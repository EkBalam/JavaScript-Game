class Meetup {
    organise() {}
    static getMeetupFounderDetails() {
        console.log("Meetup Founder Details");
    }
}
class techMeet extends Meetup {
    organise() {
        super.organise();
        console.log('Organising techMeet');
        //super.organise();
    }
    static getMeetupFounderDetails() {
        console.log("techMeet Founder Details");
        super.getMeetupFounderDetails();
    }
}
let js = new techMeet();
js.organise();
/* Output: 
Organising techMeet
Organising Meetup */
techMeet.getMeetupFounderDetails();
/* Output: 
techMeet Founder Details
Meetup Founder Details */