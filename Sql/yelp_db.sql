create user 'guestuser'@'%' IDENTIFIED BY 'password';
 
grant SELECT ON yelp_db.* to 'guestuser'@'%';

drop table tip;
 
drop table friend;

drop table elite_years;

drop table review;

drop table user;

drop table checkin;

alter table category drop foreign key fk_categories_business1;

alter table category add constraint fk_categories_business1  FOREIGN KEY (`business_id`) REFERENCES `business` (`id`) ON DELETE CASCADE;


alter table hours drop foreign key fk_hours_business1;

alter table hours add constraint fk_hours_business1  FOREIGN KEY (`business_id`) REFERENCES `business` (`id`) ON DELETE CASCADE;



alter table attribute drop foreign key fk_table1_business;

alter table attribute add constraint fk_table1_business  FOREIGN KEY (`business_id`) REFERENCES `business` (`id`) ON DELETE CASCADE;


alter table photo drop foreign key fk_photo_business1;

alter table photo add constraint fk_photo_business1  FOREIGN KEY (`business_id`) REFERENCES `business` (`id`) ON DELETE CASCADE;


delete from business where id NOT IN(select distinct business_id from category where category='Restaurant' OR category = 'Nightlife');

alter table business drop column neighbourhood;

alter table business 
add phone, email, url to business




